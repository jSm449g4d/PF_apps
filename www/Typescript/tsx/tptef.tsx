import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb, fb_errmsg } from "./component/account";
import { stopf5 } from "./component/stopf5";

const storage = fb.storage();
const db = fb.firestore();

interface State {
    uid: string; unsnaps: any; room: string; handlename: string;
    thread: { [keys: string]: { attachment_dir: string, content: string, handlename: string } }
}

export class Tptef_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", unsnaps: [], room: "main", handlename: "窓の民は名無し", thread: {}
        };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }
    componentDidMount() {
        for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
        this.setState({ unsnaps: [this.db_Rwd_getroom.bind(this)(),] })
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.room != prevState.room) {
            for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
            this.setState({ unsnaps: [this.db_Rwd_getroom.bind(this)(),] })
        }
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    //functions
    db_Rwd_getroom() {
        if (this.state.room == "") return () => { };
        return db.doc("tptef/" + this.state.room).onSnapshot((doc) => {
            if (doc.exists == false) {
                this.setState({
                    thread: {
                        [Date.now().toString() + "_" + "NULL"]: {
                            handlename: "NULL", content: "Thread is not exist", attachment_dir: "",
                        }
                    }
                })
            } else { this.setState({ thread: doc.data() }) }
        })
    }

    db_rWd_addremark(submit_content: string, attach_a_file: any) {
        if (this.state.uid == "" || this.state.room == "") return;
        if (submit_content == "") { alert("Plz input content"); return; };
        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
        let attachment_dir: string = "";
        if (attach_a_file) {
            attachment_dir = "tptef/" + this.state.uid + "/" + attach_a_file.name;
            storage.ref(attachment_dir).put(attach_a_file).catch((err) => { fb_errmsg(err) });;
        }
        db.doc("tptef/" + this.state.room).set({
            [Date.now().toString() + "_" + this.state.uid]: {
                handlename: this.state.handlename,
                content: submit_content,
                attachment_dir: attachment_dir,
            }
        }, { merge: true }).catch((err) => { fb_errmsg(err) });;
    }
    db_RwD_delremark(tsuid: string) {
        if (this.state.uid == "" || this.state.room == "") return;
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq access
        const docRef = db.doc("tptef/" + this.state.room);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data()[tsuid].attachment_dir) storage.ref(doc.data()[tsuid].attachment_dir).delete()
                docRef.set({
                    [tsuid]: fb.firestore.FieldValue.delete()
                }, { merge: true }).catch((err) => { fb_errmsg(err) });
            }
            if (Object.keys(doc.data()).length < 2) docRef.delete().catch((err) => { fb_errmsg(err) });
        });
    }
    storage_Rwd_attachment(attachment_dir: string) {
        if (stopf5.check("3", 500) == false) return; // To prevent high freq access
        storage.ref(attachment_dir).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        }).catch((err) => { fb_errmsg(err) });
    }

    //renders
    render_thread_table() {
        const doc_redoces: any = Object.assign(this.state.thread);
        const tmp_recodes = [];
        const tsuids = Object.keys(doc_redoces).sort();
        for (var i = 0; i < tsuids.length; i++) {
            const tmp_data = [];
            tmp_data.push(<td key={1} style={{ textAlign: "center" }}>{doc_redoces[tsuids[i]]["handlename"]}</td>)
            tmp_data.push(<td key={2}>{doc_redoces[tsuids[i]]["content"]}</td>)
            tmp_data.push(<td key={3} style={{ fontSize: "12px", textAlign: "center" }}>
                {tsuids[i].split("_")[0]}<br />{tsuids[i].split("_")[1]}</td>)
            const tmp_datum = []; {
                //delete button
                if (tsuids[i].split("_")[1] == this.state.uid) tmp_datum.push(
                    <button key={1} className="btn btn-outline-danger btn-sm m-1 rounded-pill"
                        onClick={(evt: any) => { this.db_RwD_delremark(evt.target.name) }} name={tsuids[i]}>delete</button>)
                //attachment download button
                if (doc_redoces[tsuids[i]]["attachment_dir"] != "") tmp_datum.push(
                    <button key={2} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { this.storage_Rwd_attachment(evt.target.name) }}
                        name={doc_redoces[tsuids[i]]["attachment_dir"]}>
                        {doc_redoces[tsuids[i]]["attachment_dir"].split("/").pop().slice(0, 15)}</button>)
            }
            tmp_data.push(<td key={4} style={{ textAlign: "center" }}>{tmp_datum}</td>)
            tmp_recodes.push(<tr key={i}>{tmp_data}</tr>)
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
                <tbody>{tmp_recodes}</tbody>
            </table>)
    }
    render() {
        return (
            <div className="m-2">
                <h2 style={{ color: "black" }}>Chat_Room</h2>
                <div className="d-flex justify-content-between">
                    <input className="form-control" id="room_name" type="text" value={this.state.room} placeholder="Room"
                        onChange={(evt) => { this.setState({ room: evt.target.value }) }} />
                    <button className="btn btn-success btn-sm ml-auto" >Goto_Room</button>
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
                                        this.db_rWd_addremark(
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

document.body.insertAdjacentHTML('beforebegin', '<div id="account_tsx">account_tsx loading...<\/div>');
document.body.insertAdjacentHTML('beforebegin', '<div id="tptef_tsx">tptef_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
ReactDOM.render(<Tptef_tsx />, document.getElementById("tptef_tsx"));
