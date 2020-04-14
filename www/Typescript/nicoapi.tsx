import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb } from "./component/account";

const storage = fb.storage();
const db = fb.firestore()

interface State {
    uid: string; API_endpoint: string; service_name: string; fields: string; orders: string;
    stopspam_timestamp: number; lastops_timestamp: number;
}

export class Nicoapi_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", API_endpoint: "https://", service_name: "← Plz \"Select API_endpoint\"",
            fields: JSON.stringify({}), orders: JSON.stringify({}),
            stopspam_timestamp: Date.now(), lastops_timestamp: Date.now(),
        };
        //check Auth
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            } else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 200)
    }
    componentDidMount() {
        this.db_cRud_getorders.bind(this)()
    }
    componentDidUpdate() {
        if (Date.now() > this.state.lastops_timestamp + 30000) {
            this.db_cRud_getorders.bind(this)()
            this.setState({ lastops_timestamp: Date.now() })
        }
    }

    //functions
    db_Crud_genorders(urls_array: string[]) {
        if (this.state.uid == "") return;
        if (confirm("Do you really want to submit?")) {
            db.doc("nicoapi/" + this.state.uid).set(
                {
                    [Date.now().toString()]: {
                        "request_urls": urls_array, "status": "standby", "User-Agent": "nicoapi"
                    }
                }
                , { merge: true });
            setTimeout(this.db_cRud_getorders.bind(this), 1000);
        };
    }
    db_cRud_getorders() {
        if (this.state.uid == "") return;
        db.doc("nicoapi/" + this.state.uid).get().then((doc) => {
            if (doc.exists == false) { this.setState({ orders: JSON.stringify({}) }) }
            else { this.setState({ orders: JSON.stringify(doc.data()) }) }
        })
    }
    storage_cRud_dlorders(target_dir: string) {
        storage.ref(target_dir).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        }).catch(() => { alert("cant download") })
    }
    _genorders() {
        const request_urls = [this.state.API_endpoint + "?"];
        const tmp_fields = JSON.parse(this.state.fields)
        const keys = Object.keys(JSON.parse(this.state.fields)).sort();
        for (let i = 0; i < keys.length; i++) {
            if (tmp_fields[keys[i]]["field"] == "") continue;
            if (tmp_fields[keys[i]]["value"].indexOf("$for(") == 0) {
                const tmp_for = tmp_fields[keys[i]]["value"].split(/[(;)]/);
                if (tmp_for.length != 5) { alert("wrong: fields→value"); return; }
                const request_url_length_before = request_urls.length
                for (let j = 0; j < request_url_length_before; j++) {
                    for (let k = Number(tmp_for[1]); k < Number(tmp_for[2]); k += Number(tmp_for[3]))
                        request_urls.push(request_urls[j] + "&" + tmp_fields[keys[i]]["field"] + "=" + String(k));
                } request_urls.splice(0, request_url_length_before); continue;
            }
            for (let j = 0; j < request_urls.length; j++) {
                request_urls[j] += "&" + tmp_fields[keys[i]]["field"] + "=" + tmp_fields[keys[i]]["value"]
            }
        }
        if (Date.now() > this.state.stopspam_timestamp + 6000) {
            this.db_Crud_genorders(request_urls); this.setState({ stopspam_timestamp: Date.now() });
        }
        else { alert("dont SPAM !\nremaining cooling time: " + String(this.state.stopspam_timestamp - Date.now() + 6000) + "[ms]") };
    }

    //renders
    render_APIendpoint_record(service_name: string, API_reference: string = "") {
        return (<tr>
            <td>
                <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#nicoapi_navber_APIendpoint_selector"
                    onClick={() => {
                        if (service_name == "ニコニコ動画") {
                            this.setState({
                                API_endpoint: "https://api.search.nicovideo.jp/api/v2/video/contents/search", service_name: service_name, fields: JSON.stringify(
                                    {
                                        [String(Date.now() - 5)]: { field: "q", value: "ゆっくり解説" },
                                        [String(Date.now() - 4)]: { field: "targets", value: "title,description,tags" },
                                        [String(Date.now() - 3)]: { field: "fields", value: "contentId,title,description,tags" },
                                        [String(Date.now() - 2)]: { field: "_sort", value: "viewCounter" },
                                        [String(Date.now() - 1)]: { field: "_limit", value: "100" },
                                        [String(Date.now() - 0)]: { field: "_offset", value: "$for(1;1601;100)" },
                                    })
                            })
                        }
                        else if (service_name == "ニコニコ生放送") {
                            this.setState({
                                API_endpoint: "https://api.search.nicovideo.jp/api/v2/live/contents/search", service_name: service_name, fields: JSON.stringify(
                                    {
                                        [String(Date.now() - 5)]: { field: "q", value: "ゆっくり解説" },
                                        [String(Date.now() - 4)]: { field: "targets", value: "title,description,tags" },
                                        [String(Date.now() - 3)]: { field: "fields", value: "contentId,title,description,tags" },
                                        [String(Date.now() - 2)]: { field: "_sort", value: "viewCounter" },
                                        [String(Date.now() - 1)]: { field: "_limit", value: "100" },
                                        [String(Date.now() - 0)]: { field: "_offset", value: "$for(1;1601;100)" },
                                    })
                            })
                        }
                        else if (service_name == "なろう小説") {
                            this.setState({
                                API_endpoint: "https://api.syosetu.com/novelapi/api/", service_name: service_name, fields: JSON.stringify(
                                    {
                                        [String(Date.now() - 3)]: { field: "gzip", value: "5" },
                                        [String(Date.now() - 2)]: { field: "out", value: "yaml" },
                                        [String(Date.now() - 1)]: { field: "lim", value: "499" },
                                        [String(Date.now() - 0)]: { field: "st", value: "$for(1;2000;499)" },
                                    })
                            })
                        }
                        else { this.setState({ API_endpoint: "https://", service_name: service_name, fields: JSON.stringify({}) }) }
                    }}>{service_name}</button></td>
            <td>{API_reference == "" ? <div>None</div> : <a href={API_reference}>{API_reference}</a>}</td>
        </tr>)
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
    render_APIendpoint_textform() {
        return (
            <div className="form-inline"><b>{this.state.service_name}</b>
                <input type="text" className="form-control form-control-sm mx-1" size={60} value={this.state.API_endpoint}
                    onChange={(evt: any) => { this.setState({ API_endpoint: evt.target.value, service_name: "カスタム" }); }} />
            </div>)
    }
    render_filelds_table() {
        const keys = Object.keys(JSON.parse(this.state.fields)).sort();
        const tmp_record = []; let tmp_fields = JSON.parse(this.state.fields);
        for (var i = 0; i < keys.length; i++) {
            const tmp_data = [];
            //Field (textform)
            tmp_data.push(<td key={1}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fields)[keys[i]]["field"]}
                onChange={(evt: any) => {
                    tmp_fields[evt.target.name]["field"] = evt.target.value; this.setState({ fields: JSON.stringify(tmp_fields) });
                }} name={keys[i]} /></td>)
            //Value (textform)
            tmp_data.push(<td key={2}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fields)[keys[i]]["value"]}
                onChange={(evt: any) => {
                    tmp_fields[evt.target.name]["value"] = evt.target.value; this.setState({ fields: JSON.stringify(tmp_fields) });
                }} name={keys[i]} /></td>)
            //Command (Delete button)
            tmp_data.push(<td key={3}><button className="btn btn-warning btn-sm" style={{ textAlign: "center" }}
                onClick={(evt: any) => {
                    tmp_fields[evt.target.name]["value"] = "$for(1;1601;500)"; this.setState({ fields: JSON.stringify(tmp_fields) })
                }} name={keys[i]}>$for</button></td>)
            //Ops (Delete button)
            tmp_data.push(<td key={4}><button className="btn btn-outline-danger btn-sm rounded-pill" style={{ textAlign: "center" }}
                onClick={(evt: any) => {
                    delete tmp_fields[evt.target.name]; this.setState({ fields: JSON.stringify(tmp_fields) })
                }} name={keys[i]}>Delete</button></td>)
            tmp_record.push(<tr key={i}>{tmp_data}</tr>)
        }
        return (
            <table className="table table-sm">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ width: "10%" }}>Field</th>
                        <th>Value</th>
                        <th style={{ width: "8%" }}>Command</th>
                        <th style={{ width: "8%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>
                    {tmp_record}
                    <tr className="my-2"><td />
                        <td className="d-flex justify-content-center"><button className="btn btn-outline-primary rounded-pill" style={{ width: "50%" }}
                            onClick={() => {
                                this.setState({ fields: JSON.stringify(Object.assign(JSON.parse(this.state.fields), { [Date.now().toString()]: { field: "", value: "" } })) })
                            }}>+Add</button>
                        </td>
                        <td><button className="btn btn-success" onClick={() => { this._genorders(); }}>Launch</button></td>
                    </tr>
                </tbody>
            </table>)
    }
    render_orders_text() {
        let num: Number = 0; let keys = Object.keys(JSON.parse(this.state.orders));
        for (let i = 0; i < keys.length; i++) { num += JSON.parse(this.state.orders)[keys[i]]["request_urls"].length }
        return (<div className="mx-3">{"orders / requests: " + String(keys.length) + " / " + String(num)}</div>)
    }
    render_orders_table() {
        const keys = Object.keys(JSON.parse(this.state.orders)).sort();
        const tmp_record = []; let tmp_orders = JSON.parse(this.state.orders);
        for (var i = 0; i < keys.length; i++) {
            const tmp_data = [];
            tmp_data.push(<td key={1} style={{ textAlign: "center" }}>
                {keys[i]}<br />Status: {tmp_orders[keys[i]]["status"]}<br />UA: {tmp_orders[keys[i]]["User-Agent"]}</td>)
            tmp_data.push(<td key={2} style={{ fontSize: "12px" }}>{tmp_orders[keys[i]]["request_urls"].join('\n')}</td>)
            const tmp_datum = []; {// col: Ops
                //download button
                if (tmp_orders[keys[i]]["status"] == "processed") tmp_datum.push(
                    <button key={1} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { this.storage_cRud_dlorders("nicoapi/" + this.state.uid + "/" + evt.target.value + ".zip") }}
                        value={keys[i]}>Download</button>)
                //attachment download button
                if (tmp_orders[keys[i]]["status"] == "processed") tmp_datum.push(
                    <button key={2} className="btn btn-outline-danger btn-sm m-1"
                        onClick={(evt: any) => { alert("Under Construction") }} // TODO: delete from GCS
                        value={keys[i]}>Delete</button>)
            }
            tmp_data.push(<td key={3} style={{ textAlign: "center" }}>{tmp_datum}</td>)

            tmp_record.push(<tr key={i}>{tmp_data}</tr>)
        }
        if (keys.length == 0) { tmp_record.push(<tr><td colSpan={3} style={{ textAlign: "center" }}>Not Exist</td></tr>); }
        return (
            <table className="table table-sm">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ width: "10%" }} >Timestamp/Info</th>
                        <th>Request URLs</th>
                        <th style={{ width: "10%" }} >Ops</th>
                    </tr>
                </thead>
                <tbody>
                    {tmp_record}
                </tbody>
            </table>)
    }
    render() {
        return (
            <div className="m-2">
                {this.state.uid == "" ?
                    <h4 className="d-flex justify-content-center">This application cant use without login</h4> :
                    <div>
                        {/* INPUT console */}
                        <div style={{ backgroundColor: "lightcyan" }}>
                            {/* HELP collapse */}
                            <div className="collapse" id="nicoapi_navber_help">
                                <h4 className="d-flex justify-content-center" style={{ fontStyle: "Sylfaen" }}>Command</h4>
                                <div className="d-flex justify-content-center">一度に複数のリクエストを行う為の、特殊なvalueの入力方法です。</div>
                                <h5>$for(A;B;C)</h5>
                                <li style={{ listStyle: "none" }}>A:開始の数値 B:終了条件の数値(上限) C:インクリメント</li>
                                <li style={{ listStyle: "none" }}>一度のリクエストで得られるレコード数(limit)が限られる際等に、繰り返し要求を出すときに使用します。</li>
                            </div>
                            {/* collapse navigation */}
                            <nav className="navbar" style={{ backgroundColor: "paleturquoise" }}>
                                <div>
                                    <button className="btn btn-success rounded-pill mx-1" data-toggle="collapse" data-target="#nicoapi_navber_help">HELP</button>
                                    <button className="btn btn-primary mx-1" data-toggle="collapse" data-target="#nicoapi_navber_APIendpoint_selector">Select API_endpoint</button>
                                </div>
                                {this.render_APIendpoint_textform()}
                            </nav>
                            {/* API_endpoint collapse */}
                            <div className="collapse" id="nicoapi_navber_APIendpoint_selector">
                                {this.render_APIendpoint_table()}
                            </div>
                        </div>
                        {this.render_filelds_table()}

                        {/* OUTPUT console */}
                        <div style={{ backgroundColor: "lightyellow" }}>
                            <nav className="navbar" style={{ backgroundColor: "wheat" }}>
                                <div className="form-inline">
                                    <button className="btn btn-info btn-sm" data-toggle="collapse" data-target="#nicoapi_navber_orders"
                                        onClick={() => { this.db_cRud_getorders() }}>Orders</button>
                                    {this.render_orders_text()}
                                </div>
                            </nav>
                            {/* Orderstable collapse */}
                            <div className="collapse" id="nicoapi_navber_orders">
                                {this.render_orders_table()}
                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    };
};//
ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(<Nicoapi_tsx />,
    document.getElementById("nicoapi_tsx")
);
