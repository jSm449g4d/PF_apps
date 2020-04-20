import React from 'react';
import { auth } from "./component/account";


interface State {
    uid: string; unsnaps: any;
}


export class Homepage_tsx extends React.Component<{}, State> {
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
