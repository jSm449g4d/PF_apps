import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb, fb_errmsg } from "./component/account";
import { stopf5 } from "./component/util_tsx";

const storage = fb.storage();
const db = fb.firestore()

interface State {
    uid: string; unsnaps: any; APIendpoint: string; service_name: string;
    crawlerresp_dict: { thread: string, [key: string]: string };
    fields: { [timestamp: string]: { field: string, value: string, [keys: string]: string } };
    db_nicoapi: { [tsuid: string]: { request_urls: any, status: string, "User-Agent": string, [keys: string]: string } };
}

export class Nicoapi_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", unsnaps: [], APIendpoint: "https://", service_name: "カスタム", crawlerresp_dict: { thread: "stop" },
            fields: {}, db_nicoapi: {}
        };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.uid != prevState.uid) {
            for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
            this.setState({ unsnaps: [this.db_Rwd_getorders.bind(this)(),] })
        }
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    // functions
    db_Rwd_getorders() {
        if (this.state.uid == "") return () => { };
        return db.doc("nicoapi/" + this.state.uid).onSnapshot((doc) => {
            if (doc.exists == false) { this.setState({ db_nicoapi: {} }) }
            else { this.setState({ db_nicoapi: doc.data() }) }
        });
    }
    db_rWd_genorders(urls_array: string[], urlslimit: number = 300) {
        if (this.state.uid == "") return;
        if (urls_array.length > urlslimit) { alert("error: Too many → " + String(urls_array.length) + "[req]"); return; }
        if (confirm(String(urls_array.length) + "[req]\nDo you really want to place this ORDER?") == false) return;
        if (stopf5.check("1", 6000, true) == false) return; // To prevent high freq access
        db.doc("nicoapi/" + this.state.uid).set(
            {
                [Date.now().toString() + "_" + this.state.uid]: {
                    "request_urls": urls_array, "status": "standby"
                    , "User-Agent": String(Math.random() * 1000000).split(".")[0]
                }
            }, { merge: true }).then(() => {
                setTimeout(() => { // access to backend
                    const xhr: XMLHttpRequest = new XMLHttpRequest();
                    xhr.open("POST", "/Flask/nicoapi/main.py", true);
                    xhr.onload = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            console.log(xhr.responseText);
                            this.setState({ crawlerresp_dict: JSON.parse(xhr.responseText) })
                        }
                    };
                    xhr.send(null);
                }, 1000)
            }).catch((err) => fb_errmsg(err))
    }
    db_rwD_delorders(tsuid: string) {
        if (this.state.uid == "") return;
        db.doc("nicoapi/" + this.state.uid)
            .set({ [tsuid]: fb.firestore.FieldValue.delete() }, { merge: true }).catch((err) => fb_errmsg(err))
    }
    storage_Rwd_dlorders(tsuid: string) {
        if (stopf5.check("2", 500) == false) return; // To prevent high freq access
        storage.ref("nicoapi/" + this.state.uid + "/" + tsuid + ".zip")
            .getDownloadURL().then((url) => { window.open(url, '_blank'); }).catch((err: any) => { fb_errmsg(err) })
    }
    storage_rwD_delorders(tsuid: string) {
        if (this.state.uid == "") return;
        if (stopf5.check("3", 500) == false) return; // To prevent high freq access
        storage.ref("nicoapi/" + this.state.uid + "/" + tsuid + ".zip").delete().catch((err) => { fb_errmsg(err) });
        this.db_rwD_delorders(tsuid)
    }
    _genorders() {
        const request_urls = [this.state.APIendpoint.replace("?", "") + "?"];
        const tmp_fields = Object.assign(this.state.fields)
        const timestamp = Object.keys(this.state.fields).sort();
        for (let i = 0; i < timestamp.length; i++) {
            if (tmp_fields[timestamp[i]]["field"] == "") continue;
            if (tmp_fields[timestamp[i]]["value"].indexOf("$for(") == 0) {
                const tmp_for = tmp_fields[timestamp[i]]["value"].split(/[(;)]/);
                if (tmp_for.length != 5) { alert("wrong: fields→value"); return; }
                const request_url_length_before = request_urls.length
                for (let j = 0; j < request_url_length_before; j++) {
                    for (let k = Number(tmp_for[1]); k < Number(tmp_for[2]); k += Number(tmp_for[3]))
                        request_urls.push(request_urls[j] + "&" + tmp_fields[timestamp[i]]["field"] + "=" + String(k));
                } request_urls.splice(0, request_url_length_before); continue;
            }
            for (let j = 0; j < request_urls.length; j++) {
                request_urls[j] += "&" + tmp_fields[timestamp[i]]["field"] + "=" + tmp_fields[timestamp[i]]["value"]
            }
        }
        this.db_rWd_genorders(request_urls);
    }


    // renders
    render_helpapp() {
        return (
            <div className="p-1 border">
                <h4 className="d-flex justify-content-center" style={{ fontStyle: "Sylfaen" }}>
                    Command
                </h4>
                <div className="d-flex justify-content-center">
                    一度に複数のリクエストを行う為の、特殊なvalueの入力方法です。
                </div>
                <h5>$for(A;B;C)</h5>
                <li style={{ listStyle: "none" }}>A:開始の数値 B:終了条件の数値(上限) C:インクリメント</li>
                <li style={{ listStyle: "none" }}>一度のリクエストで得られるレコード数(limit)が限られる際等に、繰り返し要求を出すときに使用します。</li>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-secondary btn-sm m-2" data-toggle="collapse" data-target="#helpapp_collapse">
                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                    </button>
                </div>
            </div>
        )
    }
    render_helpcmd() {
        return (
            <div className="p-1 border" style={{ backgroundColor: "wheat" }}>
                <h4 className="d-flex justify-content-center" style={{ fontStyle: "Sylfaen" }}>
                    Command
                </h4>
                <div className="d-flex justify-content-center">
                    一度に複数のリクエストを行う為の、特殊なvalueの入力方法です。
                </div>
                <h5>$for(A;B;C)</h5>
                <li style={{ listStyle: "none" }}>A:開始の数値 B:終了条件の数値(上限) C:インクリメント</li>
                <li style={{ listStyle: "none" }}>一度のリクエストで得られるレコード数(limit)が限られる際等に、繰り返し要求を出すときに使用します。</li>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-secondary btn-sm m-2" data-toggle="collapse" data-target="#helpcmd_collapse">
                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                    </button>
                </div>
            </div>
        )
    }
    render_APIendpoint_record(service_name: string, API_reference: string = "") {
        return (
            <tr>
                <td>
                    <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#APIendpoint_collapse"
                        onClick={() => {
                            if (service_name == "ニコニコ動画") {
                                this.setState({
                                    APIendpoint: "https://api.search.nicovideo.jp/api/v2/video/contents/search", service_name: service_name, fields:
                                    {
                                        [String(Date.now() - 5)]: { field: "q", value: "ゆっくり解説" },
                                        [String(Date.now() - 4)]: { field: "targets", value: "title,description,tags" },
                                        [String(Date.now() - 3)]: { field: "fields", value: "contentId,title,description,tags" },
                                        [String(Date.now() - 2)]: { field: "_sort", value: "viewCounter" },
                                        [String(Date.now() - 1)]: { field: "_limit", value: "100" },
                                        [String(Date.now() - 0)]: { field: "_offset", value: "$for(1;1601;100)" },
                                    }
                                })
                            }
                            else if (service_name == "ニコニコ生放送") {
                                this.setState({
                                    APIendpoint: "https://api.search.nicovideo.jp/api/v2/live/contents/search", service_name: service_name, fields:
                                    {
                                        [String(Date.now() - 5)]: { field: "q", value: "ゆっくり解説" },
                                        [String(Date.now() - 4)]: { field: "targets", value: "title,description,tags" },
                                        [String(Date.now() - 3)]: { field: "fields", value: "contentId,title,description,tags" },
                                        [String(Date.now() - 2)]: { field: "_sort", value: "viewCounter" },
                                        [String(Date.now() - 1)]: { field: "_limit", value: "100" },
                                        [String(Date.now() - 0)]: { field: "_offset", value: "$for(1;1601;100)" },
                                    }
                                })
                            }
                            else if (service_name == "なろう小説") {
                                this.setState({
                                    APIendpoint: "https://api.syosetu.com/novelapi/api/", service_name: service_name, fields:
                                    {
                                        [String(Date.now() - 1)]: { field: "lim", value: "499" },
                                        [String(Date.now() - 0)]: { field: "st", value: "$for(1;2000;499)" },
                                    }
                                })
                            }
                            else { this.setState({ APIendpoint: "https://", service_name: service_name, fields: {} }) }
                        }}>
                        {service_name}
                    </button>
                </td>
                <td>
                    {API_reference == "" ?
                        <div>None</div>
                        :
                        <a href={API_reference}>{API_reference}</a>
                    }
                </td>
            </tr>
        )
    }
    render_APIendpoint_table() {
        return (
            <table className="table table-sm">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th>endpoint</th>
                        <th>reference</th>
                    </tr>
                </thead>
                <tbody>
                    {this.render_APIendpoint_record("ニコニコ動画", "https://site.nicovideo.jp/search-api-docs/search.html")}
                    {this.render_APIendpoint_record("ニコニコ生放送", "https://site.nicovideo.jp/search-api-docs/search.html")}
                    {this.render_APIendpoint_record("なろう小説", "https://dev.syosetu.com/man/api/")}
                    {this.render_APIendpoint_record("カスタム", "")}
                </tbody>
            </table>
        )
    }
    render_APIendpoint_formtext() {
        return (
            <div className="form-inline">
                <b>{this.state.service_name}</b>
                <input type="text" className="form-control form-control-sm mx-1" size={60} value={this.state.APIendpoint}
                    onChange={(evt: any) => { this.setState({ APIendpoint: evt.target.value, service_name: "カスタム" }); }} />
            </div>)
    }
    render_filelds_table() {
        const timestamp = Object.keys(this.state.fields).sort();
        const tmp_record = []; let tmp_fields = Object.assign(this.state.fields);
        for (var i = 0; i < timestamp.length; i++) {
            const tmp_data = [];
            //Field (formtext)
            tmp_data.push(<td key={1}><input type="text" className="form-control form-control-sm mx-1"
                value={this.state.fields[timestamp[i]]["field"]}
                onChange={(evt: any) => {
                    tmp_fields[evt.target.name]["field"] = evt.target.value; this.setState({ fields: tmp_fields });
                }} name={timestamp[i]} /></td>)
            //Value (textform)
            tmp_data.push(<td key={2}><input type="text" className="form-control form-control-sm mx-1"
                value={this.state.fields[timestamp[i]]["value"]}
                onChange={(evt: any) => {
                    tmp_fields[evt.target.name]["value"] = evt.target.value; this.setState({ fields: tmp_fields });
                }} name={timestamp[i]} /></td>)
            //Command (button)
            tmp_data.push(<td key={3}><button className="btn btn-warning btn-sm" style={{ textAlign: "center" }}
                onClick={(evt: any) => {
                    tmp_fields[evt.target.name]["value"] = "$for(1;1601;500)"; this.setState({ fields: tmp_fields })
                }} name={timestamp[i]}>$for</button></td>)
            //Ops (Delete button)
            tmp_data.push(<td key={4}><button className="btn btn-outline-danger btn-sm rounded-pill" style={{ textAlign: "center" }}
                onClick={(evt: any) => {
                    delete tmp_fields[evt.target.name]; this.setState({ fields: tmp_fields })
                }} name={timestamp[i]}><i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Del</button></td >)
            tmp_record.push(<tr key={i}>{tmp_data}</tr>)
        }
        return (
            <table className="table table-sm" style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <th style={{ width: "10%" }}>Field</th>
                        <th>Value</th>
                        <th style={{ width: "10%" }}>
                            <i className="fas fa-question-circle fa-lg faa-wrench animated-hover mx-1" style={{ color: "darkorange" }}
                                data-toggle="collapse" data-target="#helpcmd_collapse"></i>
                            Command
                        </th>
                        <th style={{ width: "8%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>
                    {tmp_record}
                    <tr><td /><td style={{ color: "rgba(255,255,255,0)" }}>===みつけたね？===</td></tr>
                    <tr>
                        <td />
                        <td>
                            <button className="btn btn-outline-primary rounded-pill" style={{ width: "50%" }}
                                onClick={() => {
                                    this.setState({ fields: Object.assign(this.state.fields, { [Date.now().toString()]: { field: "", value: "" } }) })
                                }}>
                                +Add
                            </button>
                        </td>
                        <td colSpan={2}>
                            <div className="form-inline">
                                <button className="btn btn-success" onClick={() => { this._genorders(); }}>
                                    <i className="fas fa-rocket mr-1" style={{ pointerEvents: "none" }}></i>Launch
                                </button>
                                {this.state.crawlerresp_dict["thread"] == "stop" ?
                                    <i className="fab fa-ubuntu fa-2x mx-2" style={{ color: "darkorange" }}></i>
                                    :
                                    <i className="fab fa-ubuntu fa-2x fa-spin mx-2" style={{ color: "darkorange" }}></i>
                                }
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>)
    }
    render_orders_text() {
        let num: Number = 0; let tsuids = Object.keys(this.state.db_nicoapi);
        for (let i = 0; i < tsuids.length; i++) { num += this.state.db_nicoapi[tsuids[i]]["request_urls"].length }
        return (
            <div className="mx-2">
                {"orders/requests: " + String(tsuids.length) + "/" + String(num)}
            </div>
        )
    }
    render_orders_table() {
        const tsuids = Object.keys(this.state.db_nicoapi).sort();
        const tmp_records = []; let doc_records = Object.assign(this.state.db_nicoapi);
        for (var i = 0; i < tsuids.length; i++) {
            const tmp_data = [];
            tmp_data.push(<td key={1}>
                {tsuids[i].split("_")[0]}<br />Status: {doc_records[tsuids[i]]["status"]}<br />
                UA: {doc_records[tsuids[i]]["User-Agent"]}</td>)
            tmp_data.push(<td key={2} style={{ fontSize: "12px", textAlign: "left" }}>
                <details><summary> {doc_records[tsuids[i]]["request_urls"][0]}</summary>
                    {doc_records[tsuids[i]]["request_urls"].slice(1).join('\n')}</details></td>)
            const tmp_datum = []; {// col: Ops
                //download button
                if (doc_records[tsuids[i]]["status"] == "processed") tmp_datum.push(
                    <button key={1} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { this.storage_Rwd_dlorders(evt.target.name) }}
                        name={tsuids[i]}>Download</button>)
                //attachment download button
                if (doc_records[tsuids[i]]["status"] == "processed") tmp_datum.push(
                    <button key={2} className="btn btn-outline-danger btn-sm m-1"
                        onClick={(evt: any) => { this.storage_rwD_delorders(evt.target.name) }}
                        name={tsuids[i]}>Delete</button>)
            } tmp_data.push(<td key={3}>{tmp_datum}</td>)
            tmp_records.push(<tr key={i}>{tmp_data}</tr>)
        }
        if (tsuids.length == 0) { tmp_records.push(<tr><td colSpan={3}>Not Exist</td></tr>); }
        return (
            <table className="table table-sm table-bordered" style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <th style={{ width: "10%" }} >Timestamp/Info</th>
                        <th>Request URLs</th>
                        <th style={{ width: "10%" }} >Ops</th>
                    </tr>
                </thead>
                <tbody>
                    {tmp_records}
                </tbody>
            </table>
        )
    }
    render() {
        return (
            <div className="m-2">
                {this.state.uid == "" ?
                    <h5><i className="fas fa-wind mr-1"></i>Plz login</h5>
                    :
                    <div>
                        {/* INPUT console */}
                        <div style={{ backgroundColor: "lightcyan" }}>
                            <div className="collapse" id="helpapp_collapse">
                                {this.render_helpapp()}
                            </div>
                            {/* collapse navigation */}
                            <nav className="navbar" style={{ backgroundColor: "paleturquoise" }}>
                                <div className="form-inline">
                                    <i className="fas fa-question-circle fa-2x faa-wrench animated-hover mx-1" style={{ color: "darkorange" }}
                                        data-toggle="collapse" data-target="#helpapp_collapse">
                                    </i>
                                    <button className="btn btn-primary mx-1" data-toggle="collapse" data-target="#APIendpoint_collapse">
                                        <i className="far fa-caret-square-down mr-1" style={{ pointerEvents: "none" }}></i>APIendpoint
                                    </button>
                                </div>
                                {this.render_APIendpoint_formtext()}
                            </nav>
                            <div className="collapse show" id="APIendpoint_collapse">
                                {this.render_APIendpoint_table()}
                            </div>
                            <div className="collapse" id="helpcmd_collapse">
                                {this.render_helpcmd()}
                            </div>
                        </div>
                        {this.render_filelds_table()}
                        {/* OUTPUT console */}
                        <div style={{ backgroundColor: "lightyellow" }}>
                            <nav className="navbar" style={{ backgroundColor: "wheat" }}>
                                <div className="form-inline">
                                    <button className="btn btn-info btn-sm" data-toggle="collapse" data-target="#orders_collapse">
                                        <i className="far fa-file-alt mr-1" style={{ pointerEvents: "none" }}></i>Orders
                                    </button>
                                    {this.render_orders_text()}
                                </div>
                            </nav>
                            <div className="collapse" id="orders_collapse">
                                {this.render_orders_table()}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
};


document.body.insertAdjacentHTML('afterbegin', '<div id="app_tsx">app_tsx loading...<\/div>');
document.body.insertAdjacentHTML('afterbegin', '<div id="account_tsx">account_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
ReactDOM.render(<Nicoapi_tsx />, document.getElementById("app_tsx"));
