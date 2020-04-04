import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db, fb } from "./component/account";

interface State {
    uid: string; API_endpoint: string, service_name: string
}

export class Nicoapi_tsx extends React.Component<{}, State> {



    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", API_endpoint: "https://site.nicovideo.jp/search-api-docs/search.html", service_name: "ニコニコ動画",
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

                        <div className="mt-2 bg-light">
                            <h5>=Query_Table=</h5>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ width: "15%" }}>Field</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <nav className="navbar">
                                <div>
                                    <button name="fields_ad" value="del" className="btn btn-dark rounded-pill">
                                        <b>Del</b>_Field</button>
                                    <button name="fields_ad" value="add" className="btn btn-outline-dark rounded-pill">
                                        <b>Add</b>_Field</button>
                                </div>
                                <div>
                                    <button name="launch" value="True" className="btn btn-success ">Launch</button>
                                </div>
                            </nav>
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
