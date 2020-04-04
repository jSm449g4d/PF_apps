import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db, fb } from "./component/account";

interface State {
    uid: string; API_endpoint: string; service_name: string; fields: string;
}

export class Nicoapi_tsx extends React.Component<{}, State> {



    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", API_endpoint: "https://site.nicovideo.jp/search-api-docs/search.html", service_name: "ニコニコ動画",
            fields: JSON.stringify({}),
        };
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            } else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 200)
    }

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
        const fields = JSON.parse(this.state.fields);
        const fields_record = [];
        const keys = Object.keys(fields).sort();
        for (var i = 0; i < keys.length; i++) {
            const fields_data = [];
            //Field (textform)
            fields_data.push(<td><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fields)[keys[i]]["field"]}
                onChange={(evt: any) => {
                    let tmp_fields = JSON.parse(this.state.fields); tmp_fields[evt.target.name.split('_').pop()]["field"] = evt.target.value;
                    this.setState({ fields: JSON.stringify(tmp_fields) });
                }} name={"nicoapi_fields_field_" + [keys[i]]} /></td>)
            //Value (textform)
            fields_data.push(<td><input type="text" className="form-control form-control-sm mx-1"
                value={JSON.parse(this.state.fields)[keys[i]]["value"]}
                onChange={(evt: any) => {
                    let tmp_fields = JSON.parse(this.state.fields); tmp_fields[evt.target.name.split('_').pop()]["value"] = evt.target.value;
                    this.setState({ fields: JSON.stringify(tmp_fields) });
                }} name={"nicoapi_fields_value_" + [keys[i]]} /></td>)
            //Ops (Delete button)
            fields_data.push(<td><button className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={(evt: any) => {
                    let tmp_fields = JSON.parse(this.state.fields); delete tmp_fields[evt.target.name.split('_').pop()];
                    this.setState({ fields: JSON.stringify(tmp_fields) })
                }} name={"nicoapi_fields_id_" + [keys[i]]}>Delete</button></td>)
            fields_record.push(<tr>{fields_data}</tr>)
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
                    <tr><td/><td className="d-flex justify-content-center"><button className="btn btn-outline-primary rounded-pill" style={{ width: "50%" }}
                        onClick={() => {
                            this.setState({ fields: JSON.stringify(Object.assign(JSON.parse(this.state.fields), { [Date.now().toString()]: { field: "", value: "" } })) })
                        }}>+Add</button>
                    </td></tr>
                </tbody>
            </table>)
    }

    render() {
        return (
            <div className="m-2">
                {this.state.uid == "" ?
                    <h4 className="m-2">This application cant use without login</h4> :
                    <div>
                        <div className="pos-f-t" style={{ backgroundColor: "#d3e2ed" }}>
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
                            <nav className="navbar" style={{ backgroundColor: "#e3f2fd" }}>
                                <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#nicoapi_navber_APIendpoint_selector">
                                    Select API_endpoint</button>
                                {this.render_textform_APIendpoint()}
                            </nav>
                        </div>
                        {this.render_table_filelds()}
                        <div className="bg-light">
                            <div className="d-flex justify-content-between">
                                <div className="ml-auto">
                                    <button className="btn btn-success" onClick={() => { alert(this.state.fields) }}>Launch</button>
                                </div>
                            </div>

                            <h5>=Download_Status=</h5>
                            <nav className="navbar">
                                <div>
                                    <button className="btn btn-info mb-1" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent_Orders" aria-controls="navbarToggleExternalContent_Orders" aria-expanded="false" aria-label="Toggle navigation">Show_Orders</button>
                                    <b></b>
                                </div>
                                <div>
                                    <button name="download" value="True" className="btn btn-primary ">Download</button>
                                    <button name="delete" value="True" className="btn btn-outline-danger ">Delete</button>
                                </div>
                            </nav>
                            <div className="collapse" id="navbarToggleExternalContent_Orders">
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
