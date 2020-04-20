import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx } from "./account";
import { stopf5 } from "./util_tsx";

// application
import * as homepage from "../application/homepage";
import * as mypage from "../application/mypage";
import * as tptef from "../application/tptef";
import * as nicoapi from "../application/nicoapi";

export function fb_errmsg(error: any) { alert("error_code:" + error.code + "\nerror_message:" + error.message); }

interface State { }

export class Widgethead_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
    }
    componentDidUpdate(prevProps: object, prevState: State) { }
    componentWillUnmount() { }

    // functions
    _switchapp(appname: any) {
        if (stopf5.check("_switchapp", 300, true) == false) return; // To prevent high freq access
        ReactDOM.render(appname, document.getElementById("app_tsx"));
    }

    // renders
    render() {
        return (
            <div className="d-flex align-items-end">
                <i className="fab fa-react fa-2x fa-spin m-2" style={{color:"mediumturquoise"}}></i>
                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        <a className="nav-item nav-link active p-1" data-toggle="tab"
                            onClick={() => { this._switchapp(<homepage.App_tsx />) }}>
                            <i className="fas fa-home mr-1"></i>ホームページ
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp(<mypage.App_tsx />) }}>
                            <i className="far fa-address-card mr-1"></i>マイページ
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp(<tptef.App_tsx />) }}>
                            <i className="far fa-comments mr-1"></i>TPTEF
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp(<nicoapi.App_tsx />) }}>
                            <i className="fas fa-database mr-1"></i>NicoAPI
                        </a>
                    </div>
                </nav>
                <div className="ml-auto">
                    <div id="account_tsx">widgethead_tsx loading...</div>
                </div>
            </div>
        );
    }
}