import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx } from "./account";
import { stopf5 } from "./util_tsx";
// apps
import { Index_tsx } from "../index";
import { Homepage_tsx } from "../homepage";
import { Mypage_tsx } from "../mypage";
import { Nicoapi_tsx } from "../nicoapi";
import { Tptef_tsx } from "../tptef";

export function fb_errmsg(error: any) { alert("error_code:" + error.code + "\nerror_message:" + error.message); }

interface State {
}

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

    //renders
    render() {
        return (
            <div>
                <div id="account_tsx">widgethead_tsx loading...</div>

                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<Index_tsx />) }}>
                            Index
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<Homepage_tsx />) }}>
                            ホームページ
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<Mypage_tsx />) }}>
                            マイページ
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<Tptef_tsx />) }}>
                            TPTEF
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<Nicoapi_tsx />) }}>
                            NicoAPI
                        </a>
                    </div>
                </nav>

            </div>
        );
    }
}


