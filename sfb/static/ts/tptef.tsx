import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db } from "./component/account";

interface State {
    room: string; thread:any;
    [key: string]: string;
}

export class Tptef_tsx extends React.Component<{}, State> {

    load_room() {
        if (this.state.room == "") return;
        let docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (!doc.exists) {
                docRef.set({});
                this.setState({ thread: {}})
            }
            else {
                this.setState({ thread: doc.data() })
            }
        });
    }
    thread_table_render(doc_data:any){
        const thread_record= [];
        let keys = Object.keys(doc_data).sort();
        for (var i = 0; i < keys.length; i++) {
            const thread_data= [];
            thread_data.push(<td>{doc_data[keys[i]]["user"]}</td>)
            thread_record.push(<tr>{thread_data}</tr>)
        }
        this.setState({ thread: <tbody>{thread_record}</tbody> })
        return(<tbody>{thread_record}</tbody>)
    }

    constructor(props: any) {
        super(props);
        this.state = {
            room: "main", thread: null
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
                    
                </table>

                <div className="mt-2 p-2" style={{ color: "#AAFEFE", border: "3px double silver", background: "#001111" }}>
                    <div id="submits" style={{ display: "none" }}>
                    </div>
                </div>
            </div >
        );
    };
};
//{this.thread_table_render(this.state.thread)}
ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(<Tptef_tsx />,
    document.getElementById("tptef_tsx")
);
