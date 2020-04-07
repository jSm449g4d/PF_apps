import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb } from "./component/account";

const storage = fb.storage();
const db = fb.firestore();

interface State {
    uid: string; room: string; thread: string; handlename: string;
}

export class Tptef_tsx extends React.Component<{}, State> {
    //constructors
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

    //functions
    db_load_room() {
        if (this.state.room == "") return;
        const docRef = db.doc("tptef/"+this.state.room)
        docRef.get().then((doc) => {
            if (doc.exists == false) {
                this.setState({
                    thread: JSON.stringify({
                        "NULL": {
                            handlename: "NULL",
                            uid: "NULL",
                            content: "Thread is not exist",
                            date: Date.now().toString(),
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
        const docRef = db.doc("tptef/"+this.state.room);
        let attachment_dir = "";
        docRef.get().then((doc) => {
            if (doc.exists == false) docRef.set({}); //create new document
            if (attach_a_file) {
                attachment_dir = "tptef/" + this.state.uid + "/" + attach_a_file.name;
                storage.ref(attachment_dir).put(attach_a_file);
            }
            docRef.update({
                [Date.now().toString()]: {
                    handlename: this.state.handlename,
                    uid: this.state.uid,
                    content: submit_content,
                    date: Date.now().toString(),
                    attachment_dir: attachment_dir,
                }
            })
        });
        setTimeout(this.db_load_room, 500);
    }
    storage_download(attachment_dir: string) {
        storage.ref(attachment_dir).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        }).catch(() => { alert("cant download") })
    }
    db_update_remark_del(remark_key: string) {
        if (this.state.uid == "" || this.state.room == "") return;
        const docRef = db.doc("tptef/"+this.state.room);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data()[remark_key].attachment_dir) storage.ref(doc.data()[remark_key].attachment_dir).delete()
                docRef.update({
                    [remark_key]: fb.firestore.FieldValue.delete()
                })
            }
            if (Object.keys(doc.data()).length <2) docRef.delete();
        });
        setTimeout(this.db_load_room, 500);
    }

    //renders
    render_table_thread() {
        const doc_data = JSON.parse(this.state.thread);
        const thread_record = [];
        const keys = Object.keys(doc_data).sort();
        for (var i = 0; i < keys.length; i++) {
            const thread_data = []; const thread_data_ops = [];
            thread_data.push(<td key={1}>{doc_data[keys[i]]["handlename"]}</td>)
            thread_data.push(<td key={2}>{doc_data[keys[i]]["content"]}</td>)
            thread_data.push(<td key={3} style={{ fontSize: "12px" }}>{doc_data[keys[i]]["date"]}<br />{doc_data[keys[i]]["uid"]}</td>)
            //delete button
            if (doc_data[keys[i]]["uid"] == this.state.uid) {
                thread_data_ops.push(
                    <button key={1} className="btn btn-outline-danger btn-sm m-1 rounded-pill"
                        onClick={(evt: any) => { this.db_update_remark_del(evt.target.value) }}
                        value={keys[i]}>delete</button>)
            }
            //attachment download button
            if (doc_data[keys[i]]["attachment_dir"] != "") {
                thread_data_ops.push(
                    <button key={2} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { this.storage_download(evt.target.value) }}
                        value={doc_data[keys[i]]["attachment_dir"]}>
                        {doc_data[keys[i]]["attachment_dir"].split("/").pop().slice(0, 20)}</button>)
            }
            thread_data.push(<td key={4}>{thread_data_ops}</td>)
            thread_record.push(<tr key={i}>{thread_data}</tr>)
        }
        return (
            <table className="table table-sm bg-light">
                <thead>
                    <tr>
                        <th style={{ width: "15%" }}>handlename</th>
                        <th>content</th>
                        <th style={{ width: "15%" }} >timestamp/uid</th>
                        <th style={{ width: "15%" }}>ops</th>
                    </tr>
                </thead>
                <tbody>{thread_record}</tbody>
            </table>)
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
                {this.render_table_thread()}
                {this.state.uid == "" ?
                    <h4 className="d-flex justify-content-center">Plz login to submit</h4> :
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