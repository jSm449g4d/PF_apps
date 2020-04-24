import React from 'react';
import ReactDOM from "react-dom";
import { Query2Dict } from "./component/util_tsx";
import { Widgethead_tsx } from "./component/widget";

// IndexPage
const App_tsx = () => {
    return (
        <div className="p-2 bg-light">
            <div className="d-flex justify-content-between">
                <h2 style={{ fontFamily: "Impact", color: "indigo" }}>
                    <i className="fas fa-book mr-1"></i>Index
                    </h2>
                <h4 style={{ fontFamily: "Century", color: "mediumturquoise" }}>
                    <i className="fab fa-react fa-lg fa-spin mr-1"></i>React
                    </h4>
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
                        <td><a href="/app_tsx.html?app_tsx=index">インデックス</a></td>
                        <td>らららららー</td>
                    </tr>
                </tbody>
            </table>
            <a className="btn btn-outline-secondary m-2" href="/">BACK</a>
        </div>
    );
};

// Widget
document.body.insertAdjacentHTML('beforeend', '<div id="widgethead_tsx">widgethead_tsx loading...<\/div>');
ReactDOM.render(<Widgethead_tsx />, document.getElementById("widgethead_tsx"));

// App
document.body.insertAdjacentHTML('beforeend', '<div id="app_tsx">app_tsx loading...<\/div>');
require.context('./application/', true, /\.ts(x?)$/)
// Alias / homepage
if ("application" in Query2Dict() == false) {
    import("./application/homepage").then((module) => {
        ReactDOM.render(<module.App_tsx />, document.getElementById("app_tsx"));
    })
}
else {
    import("./application/" + Query2Dict()["application"]).then((module) => {
        ReactDOM.render(<module.App_tsx />, document.getElementById("app_tsx"));
    })
}
