import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx } from "./account";
import { stopf5 } from "./util_tsx";
require.context('../application/', true, /\.ts(x?)$/)

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
    _switchapp2(appname: string) {
        if (stopf5.check("_switchapp", 300, true) == false) return; // To prevent high freq access
        import("../application/" + appname).then((module) => {
            ReactDOM.render(<module.App_tsx />, document.getElementById("app_tsx"));
        })
    }

    // renders
    render() {
        return (
            <div className="d-flex align-items-end">
                <i className="fab fa-react fa-2x fa-spin m-2" style={{ color: "mediumturquoise" }}></i>
                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp2("apacheindex") }}>
                            <i className="fas fa-helicopter mr-1"></i>A_Index
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp2("homepage") }}>
                            <i className="fas fa-database mr-1"></i>ホームページ
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp2("mypage") }}>
                            <i className="fas fa-database mr-1"></i>マイページ
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp2("tptef") }}>
                            <i className="fas fa-database mr-1"></i>TPTEF
                        </a>
                        <a className="nav-item nav-link p-1" data-toggle="tab"
                            onClick={() => { this._switchapp2("nicoapi") }}>
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