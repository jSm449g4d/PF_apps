import React from 'react';
import ReactDOM from "react-dom";
import { auth, } from "./component/account";
import { Query2Dict } from "./component/util_tsx";
import { Widgethead_tsx } from "./component/widget";

interface State {
    uid: string; unsnaps: any;
}

export class Index_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = { uid: "", unsnaps: [] };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps: object, prevState: State) {
    }
    componentWillUnmount() {
        for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
    }

    // functions
    render() {
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
};


document.body.insertAdjacentHTML('beforeend', '<div id="widgethead_tsx">widgethead_tsx loading...<\/div>');
document.body.insertAdjacentHTML('beforeend', '<div id="app_tsx">app_tsx loading...<\/div>');


ReactDOM.render(<Widgethead_tsx />, document.getElementById("widgethead_tsx"));
ReactDOM.render(<Index_tsx />, document.getElementById("app_tsx"));


// Alias / homepage 
if (Query2Dict()["app_tsx"] != "index") {
    import('./homepage').then((module) => {
        ReactDOM.render(<module.Homepage_tsx />, document.getElementById("app_tsx"));
    })
}
