import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb } from "./component/account";

const storage = fb.storage();
const db = fb.firestore();

interface State {
    uid: string; room: string; thread: string; handlename: string;
    lastops_timestamp: number;
}

export class Tptef_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", room: "main", handlename: "窓の民は名無し", thread: JSON.stringify({}),
            lastops_timestamp: Date.now(),
        };
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            } else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 200)
    }
    componentDidMount() {
        this.db_cRud_loadroom.bind(this)()
    }
    componentDidUpdate() {
        if (Date.now() > this.state.lastops_timestamp + 30000) {
            this.db_cRud_loadroom.bind(this)()
            this.setState({ lastops_timestamp: Date.now() })
        }
    }

    //functions
    db_Crud_addremark(submit_content: string, attach_a_file: any) {
        if (this.state.uid == "" || this.state.room == "") return;
        if (submit_content == "") { alert("Plz input content"); return; };
        let attachment_dir: string = "";
        if (attach_a_file) {
            attachment_dir = "tptef/" + this.state.uid + "/" + attach_a_file.name;
            storage.ref(attachment_dir).put(attach_a_file);
        }
        db.doc("tptef/" + this.state.room).set({
            [Date.now().toString()]: {
                handlename: this.state.handlename,
                uid: this.state.uid,
                content: submit_content,
                date: Date.now().toString(),
                attachment_dir: attachment_dir,
            }
        }, { merge: true });
        setTimeout(this.db_cRud_loadroom.bind(this), 500);
    }
    db_cRud_loadroom() {
        if (this.state.room == "") return;
        db.doc("tptef/" + this.state.room).get().then((doc) => {
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
            } else { this.setState({ thread: JSON.stringify(doc.data()) }) }
        });
    };
    db_cRuD_delremark(remark_key: string) {
        if (this.state.uid == "" || this.state.room == "") return;
        const docRef = db.doc("tptef/" + this.state.room);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data()[remark_key].attachment_dir) storage.ref(doc.data()[remark_key].attachment_dir).delete()
                docRef.set({
                    [remark_key]: fb.firestore.FieldValue.delete()
                }, { merge: true })
            }
            if (Object.keys(doc.data()).length < 2) docRef.delete();
        }); setTimeout(this.db_cRud_loadroom.bind(this), 500);
    }
    storage_cRud_attachment(attachment_dir: string) {
        storage.ref(attachment_dir).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        }).catch(() => { alert("cant download") })
    }

    //renders
    render_thread_table() {
        const doc_data = JSON.parse(this.state.thread);
        const tmp_recode = [];
        const keys = Object.keys(doc_data).sort();
        for (var i = 0; i < keys.length; i++) {
            const tmp_data = [];
            tmp_data.push(<td key={1} style={{ textAlign: "center" }}>{doc_data[keys[i]]["handlename"]}</td>)
            tmp_data.push(<td key={2}>{doc_data[keys[i]]["content"]}</td>)
            tmp_data.push(<td key={3} style={{ fontSize: "12px", textAlign: "center" }}>
                {doc_data[keys[i]]["date"]}<br />{doc_data[keys[i]]["uid"]}</td>)
            const tmp_datum = []; {
                //delete button
                if (doc_data[keys[i]]["uid"] == this.state.uid) tmp_datum.push(
                    <button key={1} className="btn btn-outline-danger btn-sm m-1 rounded-pill"
                        onClick={(evt: any) => { this.db_cRuD_delremark(evt.target.value) }} value={keys[i]}>delete</button>)
                //attachment download button
                if (doc_data[keys[i]]["attachment_dir"] != "") tmp_datum.push(
                    <button key={2} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { this.storage_cRud_attachment(evt.target.value) }}
                        value={doc_data[keys[i]]["attachment_dir"]}>
                        {doc_data[keys[i]]["attachment_dir"].split("/").pop().slice(0, 20)}</button>)
            }
            tmp_data.push(<td key={4} style={{ textAlign: "center" }}>{tmp_datum}</td>)
            tmp_recode.push(<tr key={i}>{tmp_data}</tr>)
        }
        return (
            <table className="table table-sm bg-light">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ width: "15%" }}>Handlename</th>
                        <th>Content</th>
                        <th style={{ width: "15%" }} >Timestamp/uid</th>
                        <th style={{ width: "15%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>{tmp_recode}</tbody>
            </table>)
    }
    render() {
        return (
            <div className="m-2">
                <h2 style={{ color: "black" }}>Chat_Room</h2>
                <div className="d-flex justify-content-between">
                    <input className="form-control" id="room_name" type="text" value={this.state.room} placeholder="Room"
                        onChange={(evt) => { this.setState({ room: evt.target.value }) }} />
                    <button className="btn btn-success btn-sm ml-auto" onClick={() => { this.db_cRud_loadroom() }}>Goto_Room</button>
                </div>
                {this.render_thread_table()}
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
                                        this.db_Crud_addremark(
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
