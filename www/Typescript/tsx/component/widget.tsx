import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, } from "./account";

export function fb_errmsg(error: any) { alert("error_code:" + error.code + "\nerror_message:" + error.message); }

interface State {
    uid: string, tmpaddr: string, tmppass: string
}
export class Widgethead_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", tmpaddr: "", tmppass: ""
        };
        setInterval(() => {

        }, 100)
    }

    //renders
    render() {
        return (
            <nav className="navbar navbar-light">
                <div className="d-flex justify-content-start">
                    <a className="mx-2" href="/app_tsx.html?app_tsx=mypage.js">マイページ</a>
                    <a className="mx-2" href="/app_tsx.html?app_tsx=tptef.js">TPTEF</a>
                    <a className="mx-2" href="/app_tsx.html?app_tsx=nicoapi.js">NicoAPI</a>
                </div>
            </nav>
        );
    }
}

document.body.insertAdjacentHTML('beforeend', '<div id="account_tsx">account_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
