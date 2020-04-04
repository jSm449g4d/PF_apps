import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db, fb } from "./component/account";

interface State {
    uid: string; API_endpoint: string; service_name: string; fields: string; fors: string;
}

export class Nicoapi_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", API_endpoint: "https://site.nicovideo.jp/search-api-docs/search.html", service_name: "ニコニコ動画",
            fields: JSON.stringify({}), fors: JSON.stringify({})
        };
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            } else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 200)
    }

    //functions
    db_update_orders() {
        if (this.state.uid == "") return;
        this.state.API_endpoint;
        this.state.fields;
        var docRef = db.collection("nicoapi").doc(this.state.uid);
        docRef.get().then((doc) => {
            if (!doc.exists) { docRef.set({}); } //create new document
            docRef.update({})
        });
    }
    generate_orders() {
        const request_url = [this.state.API_endpoint+"?"];
        const tmp_fields = JSON.parse(this.state.fields)
        const keys = Object.keys(JSON.parse(this.state.fields)).sort();
        for (let i = 0; i < keys.length; i++) {
            if (tmp_fields[keys[i]]["field"] == "") continue;
            if (tmp_fields[keys[i]]["value"].indexOf("$for(") == 0) {
                const tmp_for = tmp_fields[keys[i]]["value"].split(/[(;)]/);
                if (tmp_for.length != 5) { alert("wrong:fields→value"); return; }
                const request_url_length_before = request_url.length
                for (let j = 0; j < request_url_length_before; j++) {
                    for (let k = Number(tmp_for[1]); k < Number(tmp_for[2]); k += Number(tmp_for[3]))
                        request_url.push(request_url[j] + "&" + tmp_fields[keys[i]]["field"] + "=" + String(k));
                } request_url.splice(0, request_url_length_before); continue;
            }
            for (let j = 0; j < request_url.length; j++) {
                request_url[j] += "&" + tmp_fields[keys[i]]["field"] + "=" + tmp_fields[keys[i]]["value"]
            }
        }
        alert(request_url)
    }
    show_requests() {
        const request_url = [];
        request_url.push(this.state.API_endpoint)
    }

    //renders
    render_table_APIendpoint_selector(service_name: string, API_endpoint: string, API_reference: string) {
        return (<tr>
            <td>
                <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#nicoapi_navber_APIendpoint_selector"
                    onClick={() => { this.setState({ API_endpoint: API_endpoint, service_name: service_name }) }}>
                    {service_name}</button>
            </td>
            <td>{API_reference == "" ? <div>None</div> : <a href={API_reference}>{API_reference}</a>}</td>
        </tr>)
    }
    render_textform_APIendpoint() {
        return (<div className="form-inline"><b>{this.state.service_name}</b>
            <input type="text" className="form-control form-control-sm mx-1" size={60} value={this.state.API_endpoint}
                onChange={(evt: any) => { this.setState({ API_endpoint: evt.target.value, service_name: "カスタム" }); }} />
        </div>)
    }
    render_table_filelds() {
        const keys = Object.keys(JSON.parse(this.state.fields)).sort();
        const fields_record = []; let tmp_fields = JSON.parse(this.state.fields);
        for (var i = 0; i < keys.length; i++) {
            const fields_data = [];
            //Field (textform)
            fields_data.push(<td key={1}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fields)[keys[i]]["field"]}
                onChange={(evt: any) => {
                    tmp_fields[evt.target.name]["field"] = evt.target.value; this.setState({ fields: JSON.stringify(tmp_fields) });
                }} name={keys[i]} /></td>)
            //Value (textform)
            fields_data.push(<td key={2}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fields)[keys[i]]["value"]}
                onChange={(evt: any) => {
                    tmp_fields[evt.target.name]["value"] = evt.target.value; this.setState({ fields: JSON.stringify(tmp_fields) });
                }} name={keys[i]} /></td>)
            //Ops (Delete button)
            fields_data.push(<td key={3}><button className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={(evt: any) => {
                    delete tmp_fields[evt.target.name]; this.setState({ fields: JSON.stringify(tmp_fields) })
                }} name={keys[i]}>Delete</button></td>)
            fields_record.push(<tr key={i}>{fields_data}</tr>)
        }
        return (
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th style={{ width: "15%" }}>Field</th>
                        <th>Value</th>
                        <th style={{ width: "8%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>
                    {fields_record}
                    <tr className="my-2"><td />
                        <td className="d-flex justify-content-center"><button className="btn btn-outline-primary rounded-pill" style={{ width: "50%" }}
                            onClick={() => {
                                this.setState({ fields: JSON.stringify(Object.assign(JSON.parse(this.state.fields), { [Date.now().toString()]: { field: "", value: "" } })) })
                            }}>+Add</button>
                        </td>
                        <td><button className="btn btn-success" onClick={() => { this.db_update_orders(); this.generate_orders(); }}>Launch</button></td>
                    </tr>
                </tbody>
            </table>)
    }
    render() {
        return (
            <div className="m-2">
                {this.state.uid == "" ?
                    <h4 className="m-2">This application cant use without login</h4> :
                    <div>
                        {/* INPUT console */}
                        <div style={{ backgroundColor: "lightcyan" }}>
                            <div className="collapse" id="nicoapi_navber_APIendpoint_selector">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>endpoint</th>
                                            <th>reference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.render_table_APIendpoint_selector("ニコニコ動画", "https://api.search.nicovideo.jp/api/v2/video/contents/search", "https://site.nicovideo.jp/search-api-docs/search.html")}
                                        {this.render_table_APIendpoint_selector("ニコニコ生放送", "https://api.search.nicovideo.jp/api/v2/live/contents/search", "https://site.nicovideo.jp/search-api-docs/search.html")}
                                        {this.render_table_APIendpoint_selector("なろう小説", "https://api.syosetu.com/novelapi/api/", "https://dev.syosetu.com/man/api/")}
                                        {this.render_table_APIendpoint_selector("カスタム", "https://", "")}
                                    </tbody>
                                </table>
                            </div>
                            <nav className="navbar" style={{ backgroundColor: "paleturquoise" }}>
                                <button className="btn btn-primary" data-toggle="collapse" data-target="#nicoapi_navber_APIendpoint_selector">
                                    Select API_endpoint</button>
                                {this.render_textform_APIendpoint()}
                            </nav>
                        </div>
                        {this.render_table_filelds()}

                        {/* OUTPUT console */}
                        <div style={{ backgroundColor: "lightyellow" }}>
                            <nav className="navbar" style={{ backgroundColor: "wheat" }}>
                                <div>
                                    <button className="btn btn-info btn-sm" data-toggle="collapse" data-target="#nicoapi_navber_orders">Show_Orders</button>
                                </div>
                                <div>
                                    <button className="btn btn-primary btn-sm mx-1">Download</button>
                                    <button className="btn btn-danger btn-sm mx-1">Delete</button>
                                </div>
                            </nav>
                            <div className="collapse" id="nicoapi_navber_orders">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>URL?query</th>
                                            <th>timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    };
};
ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(<Nicoapi_tsx />,
    document.getElementById("nicoapi_tsx")
);
