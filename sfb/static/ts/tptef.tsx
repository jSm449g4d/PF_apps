import React from 'react';
import ReactDOM from "react-dom";

import { Account_tsx, auth, storage, db } from "./component/account";

interface State {
    room: string;thread:string;
    [key: string]: string;
}

export class Tptef_tsx extends React.Component<{}, State> {

    load_room() {
        if (this.state.room == "") return;
        var docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (!doc.exists) {
                docRef.set({});
                this.setState({thread:"Creat!"})
            }
            else {
                this.setState({thread:"Exist!"})
            }
        });
    }

    constructor(props: any) {
        super(props);
        this.state = {
            room: "main",thread:""
        };
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            }
            else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 100)
    }

    render() {
        return (
            <div className="m-2">
                <h2 style={{ color: "black" }}>Chat_Room</h2>
                <div className="d-flex justify-content-between">
                    <input type="text" id="room_name" className="form-control" value={this.state.room} placeholder="Room"
                        onChange={(evt) => { this.setState({ room: evt.target.value }) }} />
                    <button type="button" className="btn btn-success btn-sm ml-auto" onClick={() => { this.load_room() }}>Goto_Room</button>
                </div>
                <table className="table table-sm bg-light">
                    <thead>
                        <tr>
                            <th style={{ width: "15%" }}> user_name </th>
                            <th>content</th>
                            <th style={{ width: "15%" }} > timestamp/uid </th>
                            <th style={{ width: "15%" }}>ops</th>
                        </tr>
                    </thead>
                    {this.state.thread}
                </table>

                <div className="mt-2 p-2" style={{ color: "#AAFEFE", border: "3px double silver", background: "#001111" }}>
                    <div id="submits" style={{ display: "none" }}>
                    </div>
                </div>
            </div >
        );
    };
};

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(<Tptef_tsx />,
    document.getElementById("tptef_tsx")
);
