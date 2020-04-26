import React from 'react';
import ReactDOM from "react-dom";
import { Query2Dict } from "./component/util_tsx";
import { AppWidgetHead } from "./component/widget";

// IndexPage (Not use)
const AppMain = () => {
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
            <a className="btn btn-outline-secondary m-2" href="/">BACK</a>
        </div>
    );
};

// Widget
document.body.insertAdjacentHTML('beforeend', '<div id="AppWidgetHead">AppWidgetHead loading...<\/div>');
ReactDOM.render(<AppWidgetHead />, document.getElementById("AppWidgetHead"));

// App
document.body.insertAdjacentHTML('beforeend', '<div id="appMain">appMain loading...<\/div>');
require.context('./application/', true, /\.ts(x?)$/)
// Alias / homepage
if ("application" in Query2Dict() == false) {
    import("./application/homepage").then((module) => {
        ReactDOM.render(<module.AppMain />, document.getElementById("appMain"));
    })
}
else {
    import("./application/" + Query2Dict()["application"]).then((module) => {
        ReactDOM.render(<module.AppMain />, document.getElementById("appMain"));
    })
}
