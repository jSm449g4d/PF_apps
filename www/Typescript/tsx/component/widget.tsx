import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx } from "./account";
import { stopf5, Query2Dict } from "./util_tsx";
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
    render_navitem(icon: any, title: string, application: string) {
        let addClassname: string = ""
        if (Query2Dict()["application"] == application) { addClassname += " active"; }
        return (
            <a className={"nav-item nav-link p-1" + addClassname} data-toggle="tab"
                onClick={() => { this._switchapp2(application) }}>
                {icon}{title}
            </a>
        )
    }
    render() {
        return (
            <div className="d-flex align-items-end">
                <i className="fab fa-react fa-2x fa-spin m-2" style={{ color: "mediumturquoise" }}></i>
                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        {this.render_navitem(<i className="fab fa-wordpress mr-1"></i>, "Blog", "wordpress")}
                        {this.render_navitem(<i className="fas fa-home mr-1"></i>, "ホームページ", "homepage")}
                        {this.render_navitem(<i className="far fa-address-card mr-1"></i>, "マイページ", "mypage")}
                        {this.render_navitem(<i className="far fa-comments mr-1"></i>, "チャット", "tptef")}
                        {this.render_navitem(<i className="fas fa-database mr-1"></i>, "NicoAPI", "nicoapi")}
                    </div>
                </nav>
                <div className="ml-auto">
                    <div id="account_tsx">widgethead_tsx loading...</div>
                </div>
            </div>
        );
    }
}