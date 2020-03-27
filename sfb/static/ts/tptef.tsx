import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db } from "./component/account";

interface State {
    room: string; thread: string;
    [key: string]: string;
}

export class Tptef_tsx extends React.Component<{}, State> {

    load_room() {
        if (this.state.room == "") return;
        let docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (!doc.exists) {
                docRef.set({});
                this.setState({ thread: JSON.stringify({}) })
            }
            else {
                this.setState({ thread: JSON.stringify(doc.data()) })
            }
        });
    }

    thread_table_render() {
        const doc_data = JSON.parse(this.state.thread);
        const thread_record = [];
        let keys = Object.keys(doc_data).sort();
        for (var i = 0; i < keys.length; i++) {
            const thread_data = [];
            thread_data.push(<td>{doc_data[keys[i]]["user"]}</td>)
            thread_data.push(<td>{doc_data[keys[i]]["content"]}</td>)
            thread_data.push(<td>{doc_data[keys[i]]["date"]}</td>)
            thread_data.push(<td>{doc_data[keys[i]]["attachment"]}</td>)
            thread_record.push(<tr>{thread_data}</tr>)
        }
        return (<tbody>{thread_record}</tbody>)
    }

    constructor(props: any) {
        super(props);
        this.state = {
            room: "main", thread: JSON.stringify({})
        };
    }

    render() {
        return (
            <div className="m-2">
                <h2 style={{ color: "black" }}>Chat_Room</h2>
                <div className="d-flex justify-content-between">
                    <input className="form-control" id="room_name" type="text" value={this.state.room} placeholder="Room"
                        onChange={(evt) => { this.setState({ room: evt.target.value }) }} />
                    <button className="btn btn-success btn-sm ml-auto" onClick={() => { this.load_room() }}>Goto_Room</button>
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
                    {this.thread_table_render()}
                </table>

                <div className="mt-2 p-2" style={{ color: "#AAFEFE", border: "3px double silver", background: "#001111" }}>
                    <div id="submits" style={{ display: "none" }}>
                        <h5 style={{ color: "white" }}>入力フォーム</h5>
                        <textarea className="form-control my-1" name="content" placeholder="Content"></textarea>
                        <div className="my-1 d-flex justify-content-between">
                            <div className="ml-auto">
                                <div className="form-inline">
                                    <input className="form-control form-control-sm mx-1" type="text" value="KARI" />
                                    <input type="file"/>
                                    <button className="btn btn-success mx-1">remark</button>
                                </div>
                            </div>
                        </div>

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
