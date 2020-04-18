import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb, fb_errmsg } from "./component/account";
import { stopf5, jpclock_func } from "./component/util_tsx";

const storage = fb.storage();
const db = fb.firestore();

interface State {
    uid: string; unsnaps: any; room: string; tmproom: string, tmpcontent: string, tmpfile: any, jpclock_str: string,
    db_tptef: { [tsuid: string]: { attachment_dir: string, content: string, handlename: string, [keys: string]: string } }
    profile: { nickname: string, [keys: string]: string };
}

export class Tptef_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", unsnaps: [], room: "main", tmproom: "main", tmpcontent: "", tmpfile: null, jpclock_str: "now loading",
            db_tptef: {}, profile: { nickname: "窓の民は名無し" }
        };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
            this.setState({ jpclock_str: jpclock_func() }) // Decoration
        }, 100)
    }
    componentDidMount() {
        for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
        this.setState({ unsnaps: [this.db_Rwd_getroom.bind(this)(), this.db_Rwd_getmypage.bind(this)()] })
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.room != prevState.room || this.state.uid != prevState.uid) {
            for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
            this.setState({ unsnaps: [this.db_Rwd_getroom.bind(this)(), this.db_Rwd_getmypage.bind(this)()] })
        }
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    //functions
    db_Rwd_getroom() {
        if (this.state.room == "") return () => { };
        return db.doc("tptef/" + this.state.room).onSnapshot((doc) => {
            if (doc.exists == false) {
                this.setState({
                    db_tptef: {
                        [Date.now().toString() + "_" + "NULL"]: {
                            handlename: "NULL", content: "Thread is not exist", attachment_dir: "",
                        }
                    }
                })
            } else { this.setState({ db_tptef: doc.data() }) }
        })
    }
    db_Rwd_getmypage() {
        if (this.state.uid == "") return () => { };
        return db.doc("mypage/" + this.state.uid).onSnapshot((doc) => {
            if (doc.exists) {
                const tmp_recodes = doc.data()
                const tsuids = Object.keys(tmp_recodes).sort()
                this.setState({ profile: Object.assign(Object.assign(this.state.profile), tmp_recodes[tsuids[0]]) });
            }
        })
    }

    db_rWd_addremark() {
        if (this.state.uid == "" || this.state.room == "") return;
        if (this.state.tmpcontent == "") { alert("Plz input content"); return; };
        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
        let attachment_dir: string = "";
        if (this.state.tmpfile) {
            attachment_dir = "tptef/" + this.state.uid + "/" + this.state.tmpfile.name;
            storage.ref(attachment_dir).put(this.state.tmpfile).catch((err) => { fb_errmsg(err) });;
        }
        db.doc("tptef/" + this.state.room).set({
            [Date.now().toString() + "_" + this.state.uid]: {
                handlename: this.state.profile.nickname,
                content: this.state.tmpcontent,
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
        const doc_redoces: any = Object.assign(this.state.db_tptef);
        const tmp_recodes = [];
        const tsuids = Object.keys(doc_redoces).sort();
        for (var i = 0; i < tsuids.length; i++) {
            const tmp_data = [];
            tmp_data.push(<td key={1} style={{ textAlign: "center" }}>{doc_redoces[tsuids[i]]["handlename"]}</td>)
            tmp_data.push(<td key={2}>{doc_redoces[tsuids[i]]["content"]}</td>)
            tmp_data.push(<td key={3} style={{ fontSize: "12px", textAlign: "center" }}>
                {tsuids[i].split("_")[0]}<br />{tsuids[i].split("_")[1]}</td>)
            const tmp_datum = []; {
                //attachment download button
                if (doc_redoces[tsuids[i]]["attachment_dir"] != "") tmp_datum.push(
                    <button key={1} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { this.storage_Rwd_attachment(evt.target.name) }}
                        name={doc_redoces[tsuids[i]]["attachment_dir"]}>
                        {doc_redoces[tsuids[i]]["attachment_dir"].split("/").pop().slice(0, 15)}</button>)
                //delete button
                if (tsuids[i].split("_")[1] == this.state.uid) tmp_datum.push(
                    <button key={2} className="btn btn-outline-danger btn-sm rounded-pill m-1"
                        onClick={(evt: any) => { this.db_RwD_delremark(evt.target.name) }} name={tsuids[i]}>delete</button>)
            }
            tmp_data.push(<td key={4} style={{ textAlign: "center" }}>{tmp_datum}</td>)
            tmp_recodes.push(<tr key={i}>{tmp_data}</tr>)
        }
        return (
            <table className="table table-sm table-bordered bg-light">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ width: "10%" }}>Handlename</th>
                        <th>Content</th>
                        <th style={{ width: "10%" }} >Timestamp/uid</th>
                        <th style={{ width: "10%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>{tmp_recodes}</tbody>
            </table>)
    }
    render() {
        return (
            <div className="m-2">
                <div className="d-flex justify-content-between">
                    <h3 style={{ fontFamily: "Century", color: "mediumturquoise" }}>TPTEF: Chatroom</h3>
                    <h3 style={{ color: "black" }}>{this.state.room}</h3>
                    <div className="form-inline">
                        <input className="form-control form-control-sm" type="text" value={this.state.tmproom}
                            onChange={(evt) => { this.setState({ tmproom: evt.target.value }) }}
                        />
                        <button className="btn btn-success btn-sm"
                            onClick={(evt) => { this.setState({ room: this.state.tmproom }) }}>Room Change</button>
                    </div>
                </div>
                {this.render_thread_table()}
                {this.state.uid == "" ?
                    <h5 className="d-flex justify-content-center">Plz login</h5> :
                    <div className="mt-2 p-2" style={{ color: "#CCFFFF", border: "3px double silver", background: "#001111" }}>
                        <div className="d-flex justify-content-between">
                            <h4>{this.state.profile.nickname}</h4>
                            <h5>{this.state.jpclock_str}</h5>
                            <h5>入力フォーム</h5>
                        </div>
                        <textarea className="form-control my-1" id="tptef_content" rows={6} value={this.state.tmpcontent}
                            onChange={(evt) => { this.setState({ tmpcontent: evt.target.value }) }}></textarea>
                        <div className="my-1 d-flex justify-content-between">
                            <div className="ml-auto">
                                <div className="form-inline">
                                    {/* select file */}
                                    <button type="button" className="btn btn-warning btn-sm mx-1"
                                        onClick={(evt) => { $(evt.currentTarget.children[0]).click(); }}>
                                        {this.state.tmpfile == null ? "Plz select Attachment" : this.state.tmpfile.name}
                                        <input type="file" className="d-none" value=""
                                            onChange={(evt) => { this.setState({ tmpfile: evt.target.files[0] }) }} />
                                    </button>
                                    <button className="btn btn-primary btn-sm mx-1" onClick={() => {
                                        this.db_rWd_addremark();
                                        this.setState({ tmpcontent: "", tmpfile: null });
                                    }}>remark</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
};//<input type="file" onChange={(evt) => { this.setState({ tmpfile: evt.target.files[0] }) }} />

document.body.insertAdjacentHTML('afterbegin', '<div id="app_tsx">app_tsx loading...<\/div>');
document.body.insertAdjacentHTML('afterbegin', '<div id="account_tsx">account_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
ReactDOM.render(<Tptef_tsx />, document.getElementById("app_tsx"));
