import React from 'react';
import ReactDOM from "react-dom";
import { Query2Dict } from "./component/util_tsx";
import { WidgetHead, AppWidgetHead, AppWidgetFoot } from "./component/widget";
import { easyIn } from "./component/firebaseWrapper";

// WidgetHead

if ("onpre" in Query2Dict() == true) {
    document.body.insertAdjacentHTML('beforeend', '<div id="AppWidgetHead">AppWidgetHead loading...<\/div>');
    ReactDOM.render(<WidgetHead />, document.getElementById("AppWidgetHead"));
}
else {
    document.body.insertAdjacentHTML('beforeend', '<div id="AppWidgetHead">AppWidgetHead loading...<\/div>');
    ReactDOM.render(<AppWidgetHead />, document.getElementById("AppWidgetHead"));
}
// App
document.body.insertAdjacentHTML('beforeend', '<div id="appMain">appMain loading...<\/div>');
require.context('./application/', true, /\.ts(x?)$/)
// Alias / homepage
if ("application" in Query2Dict() == false) {
    import("./application/homepage").then((module) => {
        ReactDOM.render(<module.AppMain />, document.getElementById("appMain"));
        ReactDOM.render(<module.titleLogo />, document.getElementById("titlelogo_tsx"));
    })
}
else {
    import("./application/" + Query2Dict()["application"]).then((module) => {
        ReactDOM.render(<module.AppMain />, document.getElementById("appMain"));
        ReactDOM.render(<module.titleLogo />, document.getElementById("titlelogo_tsx"));
    })
}

// WidgetFoot
if ("portfolio" in Query2Dict() == false) {
    document.body.insertAdjacentHTML('beforeend', '<div id="AppWidgetFoot">AppWidgetFoot loading...<\/div>');
    ReactDOM.render(<AppWidgetFoot />, document.getElementById("AppWidgetFoot"));
}

// DefaultLogin
if ("portfolio" in Query2Dict() == true) {
    easyIn()
}
