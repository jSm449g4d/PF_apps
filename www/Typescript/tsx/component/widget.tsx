import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import { AppAuth} from "./firebaseWrapper";
import { stopf5, Query2Dict } from "./util_tsx";
require.context('../application/', true, /\.ts(x?)$/)

export const AppWidgetHead = () => {
    useEffect(() => ReactDOM.render(<AppAuth />, document.getElementById("account_tsx")), [])
    // functions
    const _switchApp = (application: string) => {
        if (stopf5.check("_switchapp", 50, true) == false) return; // To prevent high freq access
        import("../application/" + application).then((module) => {
            ReactDOM.unmountComponentAtNode(document.getElementById("appMain"));
            ReactDOM.render(<module.AppMain />, document.getElementById("appMain"));
            ReactDOM.unmountComponentAtNode(document.getElementById("titlelogo_tsx"));
            ReactDOM.render(<module.titleLogo />, document.getElementById("titlelogo_tsx"));
        })
    }
    return (
        <div className="row">
            <div className="col-sm-12 col-md-6">
                <div className="form-inline m-2">
                    <i className="fab fa-react fa-2x fa-spin mr-2" style={{ color: "mediumturquoise" }}></i>
                    <div id="titlelogo_tsx">タイトルが未設定です</div>
                </div>
            </div>
            <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                <div className="form-inline">
                    {/*ポートフォリオの場合、アプリ一覧を操作不能にします */}
                    {Query2Dict()["portfolio"] ?
                        <div></div>
                        :
                        <button className="btn btn-link dropdown-toggle m-2 mr-3" type="button" data-toggle="dropdown">
                            <b>アプリ一覧</b>
                        </button>
                    }
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="#" onClick={() => { _switchApp("homepage") }}>
                            <i className="fas fa-home mr-1"></i>ホームページ
                    </a>
                        <a className="dropdown-item" href="#" onClick={() => { _switchApp("mypage") }}>
                            <i className="far fa-address-card mr-1"></i>マイページ
                    </a>
                        <a className="dropdown-item" href="#" onClick={() => { _switchApp("tptef") }}>
                            <i className="far fa-comments mr-1"></i>チャット
                    </a>
                        <a className="dropdown-item" href="#" onClick={() => { _switchApp("nicoapi") }}>
                            <i className="fas fa-database mr-1"></i>NicoAPI
                    </a>
                        <a className="dropdown-item" href="#" onClick={() => { _switchApp("oszv") }}>
                            <i className="fas fa-table mr-1"></i>ウェイターくん
                    </a>
                    </div>
                    <div id="account_tsx">widgethead_tsx loading...</div>
                </div>
            </div>
        </div>
    );
}

export const AppWidgetFoot = () => {
    return (
        <div className="d-flex justify-content-between p-2"
            style={{ color: "gold", backgroundColor: "royalblue", border: "3px double silver" }}>
            <div className="m-2">
                <i className="fab fa-wordpress fa-2x faa-wrench animated-hover mr-1"
                    onClick={() => window.location.href = "https://huxiin.ga/wordpress"}></i>
                <i className="fab fa-github fa-2x faa-wrench animated-hover mr-1"
                    onClick={() => window.location.href = "https://github.com/jSm449g4d/"}></i>
            </div>
            <div className="m-2">
                ===VPSdeWP===
            </div>
            <div className="m-2">
                ご自由にお使いください
            </div>
        </div>
    );
}
