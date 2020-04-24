import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import { AppAuth } from "./account";
import { stopf5, Query2Dict } from "./util_tsx";
require.context('../application/', true, /\.ts(x?)$/)

export const AppWidgetHead = () => {
    useEffect(() => ReactDOM.render(<AppAuth />, document.getElementById("account_tsx")), [])
    // functions
    const _switchApp = (application: string) => {
        if (stopf5.check("_switchapp", 300, true) == false) return; // To prevent high freq access
        import("../application/" + application).then((module) => {
            ReactDOM.unmountComponentAtNode(document.getElementById("app_tsx"))
            ReactDOM.render(<module.App_tsx />, document.getElementById("app_tsx"));
        })
    }
    // renders
    const navitemApp = (icon: any, title: string, application: string) => {
        let addClassname: string = ""
        if (Query2Dict()["application"] == application) { addClassname += " active"; }
        return (
            <a className={"nav-item nav-link p-1" + addClassname} data-toggle="tab"
                onClick={() => { _switchApp(application) }}>
                {icon}{title}
            </a>
        )
    }
    return (
        <div className="d-flex align-items-end">
            <i className="fab fa-react fa-2x fa-spin m-2" style={{ color: "mediumturquoise" }}></i>
            <nav>
                <div className="nav nav-tabs" role="tablist">
                    {navitemApp(<i className="fab fa-wordpress mr-1"></i>, "Blog", "wordpress")}
                    {navitemApp(<i className="fas fa-home mr-1"></i>, "ホームページ", "homepage")}
                    {navitemApp(<i className="far fa-address-card mr-1"></i>, "マイページ", "mypage")}
                    {navitemApp(<i className="far fa-comments mr-1"></i>, "チャット", "tptef")}
                    {navitemApp(<i className="fas fa-database mr-1"></i>, "NicoAPI", "nicoapi")}
                </div>
            </nav>
            <div className="ml-auto">
                <div id="account_tsx">widgethead_tsx loading...</div>
            </div>
        </div>
    );
}
