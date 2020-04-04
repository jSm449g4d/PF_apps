import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, storage, db, fb } from "./component/account";

interface State {
    uid: string; room: string; thread: string; handlename: string;
}

export class Tptef_tsx extends React.Component<{}, State> {

    db_load_room() {
        if (this.state.room == "") return;
        const docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (!doc.exists) {
                this.setState({
                    thread: JSON.stringify({
                        "NULL": {
                            handlename: "NULL",
                            uid: "NULL",
                            content: "Thread is not exist",
                            date: Date.now().toString(),
                            attachment_name: "",
                            attachment_dir: "",
                        }
                    })
                })
            } else {
                this.setState({ thread: JSON.stringify(doc.data()) })
            }
        });
    };

    db_update_remark_add(submit_content: string, attach_a_file: any) {
        if (this.state.uid == "" || this.state.room == "") return;
        if (submit_content == "") { alert("Plz input content"); return; };
        const docRef = db.collection("tptef").doc(this.state.room);
        const remark_key = Date.now().toString();
        let attachment_name = ""; let attachment_dir = ""
        docRef.get().then((doc) => {
            if (!doc.exists) docRef.set({});
            if (attach_a_file) {
                attachment_name = attach_a_file.name;
                attachment_dir = "tptef/" + this.state.room + "/" + remark_key;
                storage.ref(attachment_dir).put(attach_a_file);
            }
            docRef.update({
                [remark_key]: {
                    handlename: this.state.handlename,
                    uid: this.state.uid,
                    content: submit_content,
                    date: Date.now().toString(),
                    attachment_name: attachment_name,
                    attachment_dir: attachment_dir,
                }
            })
        });
        setTimeout(this.db_load_room, 500);
    }

    storage_download(attachment_dir: string) {
        storage.ref(attachment_dir).getDownloadURL().then((url) => {
            window.open(url, '_blank')
        }).catch(() => { alert("cant download") })
    }

    db_update_remark_del(remark_key: string) {
        if (this.state.uid == "" || this.state.room == "") return;
        const docRef = db.collection("tptef").doc(this.state.room);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if(doc.data()[remark_key].attachment_dir)storage.ref(doc.data()[remark_key].attachment_dir).delete()
                docRef.update({
                    [remark_key]: fb.firestore.FieldValue.delete()
                })
            }
            if(Object.keys(doc.data()).length<2)docRef.delete();
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
            thread_data.push(<td>{doc_data[keys[i]]["handlename"]}</td>)
            thread_data.push(<td>{doc_data[keys[i]]["content"]}</td>)
            thread_data.push(<td style={{ fontSize: "12px" }}>{doc_data[keys[i]]["date"]}<br />{doc_data[keys[i]]["uid"]}</td>)
            {//Data which is operation of Remark
                const thread_data_ops = [];
                if (doc_data[keys[i]]["uid"] == this.state.uid) {
                    thread_data_ops.push(
                        <button className="btn btn-danger btn-sm mx-1"
                            onClick={(evt) => { this.db_update_remark_del(evt.currentTarget.children[0].innerHTML) }}>delete
                        <div style={{ display: "none" }}>{keys[i]}</div>
                        </button>)
                }
                if (doc_data[keys[i]]["attachment_name"] != "") {
                    thread_data_ops.push(
                        <button className="btn btn-primary btn-sm mx-1" onClick={(evt) => {
                            this.storage_download(evt.currentTarget.children[0].innerHTML)
                        }}>{doc_data[keys[i]]["attachment_name"]}
                            <div style={{ display: "none" }}>{doc_data[keys[i]]["attachment_dir"]}</div>
                        </button>
                    )
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
            uid: "", room: "main", handlename: "窓の民は名無し", thread: JSON.stringify({})
        };
        this.db_load_room = this.db_load_room.bind(this);
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            } else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 200)
    }

    componentDidMount() {
        this.db_load_room()
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
                            <th style={{ width: "15%" }}>handlename</th>
                            <th>content</th>
                            <th style={{ width: "15%" }} >timestamp/uid</th>
                            <th style={{ width: "15%" }}>ops</th>
                        </tr>
                    </thead>
                    {this.thread_table_render()}
                </table>
                {this.state.uid == "" ?
                    <h4 className="m-2">Plz login to submit</h4> :
                    <div className="mt-2 p-2" style={{ color: "#AAFEFE", border: "3px double silver", background: "#001111" }}>
                        <h5 style={{ color: "white", fontStyle: "" }}>入力フォーム</h5>
                        <textarea className="form-control my-1" id="tptef_content" rows={6}></textarea>
                        <div className="my-1 d-flex justify-content-between">
                            <div className="ml-auto">
                                <div className="form-inline">
                                    <input className="form-control form-control-sm mx-1" type="text" value={this.state.handlename}
                                        onChange={(evt) => { this.setState({ handlename: evt.target.value }) }} />
                                    <input type="file" id="tptef_attachment" />
                                    <button className="btn btn-primary btn-sm mx-1" onClick={() => {
                                        this.db_update_remark_add(
                                            (document.getElementById("tptef_content") as HTMLInputElement).value,
                                            (document.getElementById("tptef_attachment") as HTMLInputElement).files[0]);
                                        (document.getElementById("tptef_content") as HTMLInputElement).value = "";
                                        (document.getElementById("tptef_attachment") as HTMLInputElement).value = "";
                                    }}>remark</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
};

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(<Tptef_tsx />,
    document.getElementById("tptef_tsx")
);
