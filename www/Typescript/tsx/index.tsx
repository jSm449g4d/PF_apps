import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, } from "./component/account";


interface State {
    uid: string; unsnaps: any;
}


export class Index_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = { uid: "", unsnaps: [] };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }
    componentDidUpdate(prevProps: object, prevState: State) {
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    //functions
    render() {
        return (
            <div className="m-2">
                <div className="d-flex justify-content-between">
                    <h2 style={{ fontFamily: "OCRB", color: "navy" }}>React_Index</h2>
                    <h4 style={{ fontFamily: "Century", color: "mediumturquoise" }}>
                        <i className="fab fa-react fa-lg fa-spin mx-2" />React+Bootstrap4</h4>
                </div>
                <table className="table table-sm table-bordered" style={{ backgroundColor: "azure", color: "#555000" }}>
                    <thead>
                        <tr>
                            <th className="text-center" colSpan={2}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>==</td>
                            <td>{"=="}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-sm table-bordered mt-2" style={{ backgroundColor: "lightcyan", color: "navy" }}>
                    <thead>
                        <tr>
                            <th className="text-center" colSpan={2}>Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><a href="/app_tsx.html?app_tsx=mypage.js">マイページ</a></td>
                            <td>MyPage</td>
                        </tr>
                        <tr>
                            <td><a href="/app_tsx.html?app_tsx=tptef.js">TPTEF</a></td>
                            <td>毎度実験に使われるチャットアプリです</td>
                        </tr>
                        <tr>
                            <td><a href="/app_tsx.html?app_tsx=nicoapi.js">NicoAPI</a></td>
                            <td>APIクローラです</td>
                        </tr>
                        <tr>
                            <td><a href="/Flask/nicoapi/main.py">nicoapi_faas</a></td>
                            <td>NicoAPIのクローラ本体です</td>
                        </tr>
                    </tbody>
                </table>
                <a className="btn btn-outline-secondary m-2" href="/">BACK</a>
            </div>
        );
    };
};

document.body.insertAdjacentHTML('afterbegin', '<div id="app_tsx">app_tsx loading...<\/div>');
document.body.insertAdjacentHTML('afterbegin', '<div id="account_tsx">account_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
ReactDOM.render(<Index_tsx />, document.getElementById("app_tsx"));
