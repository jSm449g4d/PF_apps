import React from 'react';
import ReactDOM from "react-dom";
import { auth, } from "./component/account";
import { Widgethead_tsx } from "./component/widget";


interface State {
    uid: string; unsnaps: any;
}


export class App_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = { uid: "", unsnaps: [] };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }
    componentDidUpdate(prevProps: object, prevState: State) {
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    // functions
    render() {
        return (
            <div className="p-2 bg-light">
                Under Construction
            </div>
        );
    };
};

document.body.insertAdjacentHTML('beforeend', '<div id="widgethead_tsx">widgethead_tsx loading...<\/div>');
document.body.insertAdjacentHTML('beforeend', '<div id="app_tsx">app_tsx loading...<\/div>');

ReactDOM.render(<Widgethead_tsx />, document.getElementById("widgethead_tsx"));
ReactDOM.render(<App_tsx />, document.getElementById("app_tsx"));
