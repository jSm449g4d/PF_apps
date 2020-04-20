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
            <div>
                <div id="account_tsx">widgethead_tsx loading...</div>
                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<homepage.App_tsx />) }}>
                            ホームページ
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<mypage.App_tsx />) }}>
                            マイページ
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<tptef.App_tsx />) }}>
                            TPTEF
                        </a>
                        <a className="nav-item nav-link" data-toggle="tab"
                            onClick={() => { this._switchapp(<nicoapi.App_tsx />) }}>
                            NicoAPI
                        </a>
                    </div>
                </nav>

            </div>
        );
    }
}
