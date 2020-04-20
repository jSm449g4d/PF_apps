import React from 'react';
import { auth } from "../component/account";


interface State {
    uid: string; unsnaps: any;
}

export class App_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = { uid: "", unsnaps: [] };
    }
    componentDidMount() { setInterval(this._tick.bind(this), 100) }
    componentDidUpdate(prevProps: object, prevState: State) { }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    //functions
    _tick() {
        // Auth
        if (auth.currentUser) {
            if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
        } else {
            if (this.state.uid != "") this.setState({ uid: "" });
        }
    }

    // renders
    render() {
        return (
            <div className="p-2 bg-light">
                Under Construction
            </div>
        );
    };
};
