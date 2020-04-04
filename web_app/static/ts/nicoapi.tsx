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
    show_requests() {
        const request_url = [];
        request_url.push(this.state.API_endpoint)
        //return requests_url;
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
                        <td><button className="btn btn-success" onClick={() => { alert(this.state.fields); this.db_update_orders(); }}>Launch</button></td>
                    </tr>
                </tbody>
            </table>)
    }
    render_table_fors() {
        const keys = Object.keys(JSON.parse(this.state.fors)).sort();
        const fors_record = [];
        for (var i = 0; i < keys.length; i++) {
            const fors_data = []; let tmp_fors = JSON.parse(this.state.fors);
            //Replace (textform)
            fors_data.push(<td key={1}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fors)[keys[i]]["Replace"]}
                onChange={(evt: any) => {
                    tmp_fors[evt.target.name]["Replace"] = evt.target.value; this.setState({ fors: JSON.stringify(tmp_fors) });
                }} name={keys[i]} /></td>)
            //First (textform)
            fors_data.push(<td key={2}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fors)[keys[i]]["First"]}
                onChange={(evt: any) => {
                    tmp_fors[evt.target.name]["First"] = evt.target.value; this.setState({ fors: JSON.stringify(tmp_fors) });
                }} name={keys[i]} /></td>)
            //Last (textform)
            fors_data.push(<td key={3}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fors)[keys[i]]["Last"]}
                onChange={(evt: any) => {
                    tmp_fors[evt.target.name]["Last"] = evt.target.value; this.setState({ fors: JSON.stringify(tmp_fors) });
                }} name={keys[i]} /></td>)
            //Step (textform)
            fors_data.push(<td key={4}><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fors)[keys[i]]["Step"]}
                onChange={(evt: any) => {
                    tmp_fors[evt.target.name]["Step"] = evt.target.value; this.setState({ fors: JSON.stringify(tmp_fors) });
                }} name={keys[i]} /></td>)
            //Ops (Delete button)
            fors_data.push(<td key={5}><button className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={(evt: any) => {
                    delete tmp_fors[evt.target.name]; this.setState({ fors: JSON.stringify(tmp_fors) })
                }} name={keys[i]}>Delete</button></td>)
            fors_record.push(<tr key={i}>{fors_data}</tr>)
        }
        return (
            <div className="p-2">
                <h4 className="d-flex justify-content-center">Replace_First_Last_Step → [R for R in range(F,L,S)]</h4>
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th style={{ width: "30%" }}>Replace</th>
                            <th>First</th>
                            <th>Last</th>
                            <th>Step</th>
                            <th style={{ width: "8%" }}>Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fors_record}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center"><button className="btn btn-outline-primary rounded-pill" style={{ width: "50%" }}
                    onClick={() => {
                        this.setState({
                            fors: JSON.stringify(Object.assign(JSON.parse(this.state.fors),
                                { [Date.now().toString()]: { Replace: "", First: "", Last: "", Step: "" } }))
                        })
                    }}>+Add</button>
                </div>
            </div>
        )
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
                        <div style={{ backgroundColor: "palegreen" }}>
                            <div className="collapse" id="nicoapi_navber_fors">{this.render_table_fors()}</div>
                            <div className="d-flex justify-content-center p-1" style={{ backgroundColor: "aquamarine" }}>
                                <button className="btn btn-secondary btn-sm" data-toggle="collapse" data-target="#nicoapi_navber_fors">FORS</button>
                            </div>
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
