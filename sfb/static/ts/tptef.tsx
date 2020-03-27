import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db, fb } from "./component/account";
import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { watchFile } from 'fs';

interface State {
    uid: string, room: string; thread: string;
}

export class Tptef_tsx extends React.Component<{}, State> {

    db_load_room() {
        if (this.state.room == "") return;
        const docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (!doc.exists) {
                docRef.set({});
                this.setState({ thread: JSON.stringify({}) })
            }
            else {
                this.setState({ thread: JSON.stringify(doc.data()) })
            }
        });
    };

    db_update_remark_add(remark_username: string, remark_content: string) {
        if (this.state.uid == "" || this.state.room == "") return;
        const docRef = db.collection("tptef").doc(this.state.room);
        const remark_key = Date.now().toString();
        docRef.get().then((doc) => {
            if (doc.exists) {
                docRef.update({
                    [remark_key]: {
                        user: remark_username,
                        uid: this.state.uid,
                        content: remark_content,
                        date: Date.now().toString(),
                        attachment: ""
                    }
                })
            }
        });
        setTimeout(this.db_load_room, 500);
    }

    db_update_remark_del(remark_key: string) {
        if (this.state.uid == "" || this.state.room == "") return;
        const docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (doc.exists) {
                docRef.update({
                    [remark_key]: fb.firestore.FieldValue.delete()
                })

            }
        });
        setTimeout(this.db_load_room, 500);
    }

    thread_table_render() {
        const doc_data = JSON.parse(this.state.thread);
        const thread_record = [];
        const keys = Object.keys(doc_data).sort();
        for (var i = 0; i < keys.length; i++) {
            const thread_data = [];
            thread_data.push(<div style={{ display: "none" }}>{keys[i]}</div>)
            thread_data.push(<td>{doc_data[keys[i]]["user"]}</td>)
            thread_data.push(<td>{doc_data[keys[i]]["content"]}</td>)
            thread_data.push(<td style={{ fontSize: "12px" }}>{doc_data[keys[i]]["date"]}<br />{doc_data[keys[i]]["uid"]}</td>)
            {//Data which is operation of Remark
                const thread_data_ops = [];
                if (doc_data[keys[i]]["attachment"] != "") { thread_data_ops.push(<div>{doc_data[keys[i]]["attachment"]}</div>) }
                if (doc_data[keys[i]]["uid"] == this.state.uid) {
                    thread_data_ops.push(
                        <div>
                            <button className="btn btn-danger btn-sm"
                                onClick={(evt) => { this.db_update_remark_del(evt.currentTarget.children[0].innerHTML) }}>delete
                        <div style={{ display: "none" }}>{keys[i]}</div>
                            </button>
                        </div>)
                }
                thread_data.push(<td>{thread_data_ops}</td>)
            }
            thread_record.push(<tr>{thread_data}</tr>)
        }
        return (<tbody>{thread_record}</tbody>)
    }

    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", room: "main", thread: JSON.stringify({})
        };
        this.db_load_room=this.db_load_room.bind(this);
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
                    <input className="form-control" id="room_name" type="text" value={this.state.room} placeholder="Room"
                        onChange={(evt) => { this.setState({ room: evt.target.value }) }} />
                    <button className="btn btn-success btn-sm ml-auto" onClick={() => { this.db_load_room() }}>Goto_Room</button>
                </div>
                <table className="table table-sm bg-light">
                    <thead>
                        <tr>
                            <th style={{ width: "15%" }}>user_name</th>
                            <th>content</th>
                            <th style={{ width: "15%" }} >timestamp/uid</th>
                            <th style={{ width: "15%" }}>ops</th>
                        </tr>
                    </thead>
                    {this.thread_table_render()}
                </table>
                {this.state.uid != "" ?
                    <div className="mt-2 p-2" style={{ color: "#AAFEFE", border: "3px double silver", background: "#001111" }}>
                        <h5 style={{ color: "white" }}>入力フォーム</h5>
                        <textarea className="form-control my-1" id="tptef_content" placeholder="Content"></textarea>
                        <div className="my-1 d-flex justify-content-between">
                            <div className="ml-auto">
                                <div className="form-inline">
                                    <input className="form-control form-control-sm mx-1" id="tptef_user" type="text" value="KARI" />
                                    <input type="file" />
                                    <button className="btn btn-success mx-1" onClick={() => {
                                        this.db_update_remark_add((document.getElementById("tptef_user") as HTMLInputElement).value
                                            , (document.getElementById("tptef_content") as HTMLInputElement).value);
                                    }}>remark</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <h4 className="m-2">This application cant submit without login</h4>
                }
            </div>
        );
    };
};

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(<Tptef_tsx />,
    document.getElementById("tptef_tsx")
);
