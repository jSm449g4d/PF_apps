import React from 'react';
import { auth, fb, fb_errmsg } from "../component/account";
import { stopf5, jpclock_func } from "../component/util_tsx";

const storage = fb.storage();
const db = fb.firestore();

interface State {
    uid: string; unsnaps: any; room: string; tmproom: string, tmpcontent: string, tmpfile: any, jpclock_str: string,
    db_tptef: { [tsuid: string]: { attachment_dir: string, content: string, handlename: string, [keys: string]: string } }
    profile: { nickname: string, [keys: string]: string };
}

export class App_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", unsnaps: [], room: "main", tmproom: "main", tmpcontent: "", tmpfile: null, jpclock_str: "now loading",
            db_tptef: {}, profile: { nickname: "窓の民は名無し" }
        };
    }
    componentDidMount() {
        setInterval(this._tick.bind(this), 100)
        for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
        this.setState({ unsnaps: [this.dbR_getroom.bind(this)(), this.dbR_getmypage.bind(this)()] })
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.room != prevState.room || this.state.uid != prevState.uid) {
            for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
            this.setState({ unsnaps: [this.dbR_getroom.bind(this)(), this.dbR_getmypage.bind(this)()] })
        }
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    // functions
    dbC_addremark() {
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
    dbC_delremark(tsuid: string) {
        if (this.state.room == "") return;
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq access
        this.stD_DelAttachment.bind(this)(this.state.db_tptef[tsuid].attachment_dir)
        db.doc("tptef/" + this.state.room).set(
            { [tsuid]: fb.firestore.FieldValue.delete() }, { merge: true }).catch((err) => { fb_errmsg(err) })
        if (Object.keys(this.state.db_tptef).length < 2) this.dbD_DelRoom.bind(this)();
    }
    dbR_getroom() {
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
    dbR_getmypage() {
        if (this.state.uid == "") return () => { };
        return db.doc("mypage/" + this.state.uid).onSnapshot((doc) => {
            if (doc.exists) {
                const tmp_recodes = doc.data()
                const tsuids = Object.keys(tmp_recodes).sort()
                this.setState({ profile: Object.assign(Object.assign(this.state.profile), tmp_recodes[tsuids[0]]) });
            }
        })
    }
    dbD_DelRoom() {
        db.doc("tptef/" + this.state.room).delete().catch((err) => { fb_errmsg(err) })
    }
    stR_GetAttachment(attachment_dir: string) {
        if (stopf5.check("3", 500) == false) return; // To prevent high freq access
        storage.ref(attachment_dir).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        }).catch((err) => { fb_errmsg(err) });
    }
    stD_DelAttachment(attachment_dir: string) {
        if (attachment_dir == "") return;
        if (stopf5.check("4", 500, true) == false) return; // To prevent high freq access
        storage.ref(attachment_dir).delete().catch((err) => { fb_errmsg(err) })
    }
    _tick() {
        // Auth
        if (auth.currentUser) {
            if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
        } else {
            if (this.state.uid != "") this.setState({ uid: "" });
        }
        // Clock
        this.setState({ jpclock_str: jpclock_func() })
    }

    // renders
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
                        onClick={(evt: any) => { this.stR_GetAttachment(evt.target.name) }}
                        name={doc_redoces[tsuids[i]]["attachment_dir"]}>
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {doc_redoces[tsuids[i]]["attachment_dir"].split("/").pop().slice(0, 10)}</button>)
                //delete button
                if (tsuids[i].split("_")[1] == this.state.uid) tmp_datum.push(
                    <button key={2} className="btn btn-outline-danger btn-sm rounded-pill m-1"
                        onClick={(evt: any) => { this.dbC_delremark(evt.target.name) }} name={tsuids[i]}>
                        <i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Del</button>)
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
                        <th style={{ width: "15%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>{tmp_recodes}</tbody>
            </table>
        )
    }
    render_submit_forms() {
        return (
            <div className="mt-2 p-2" style={{ color: "#CCFFFF", border: "3px double silver", background: "#001111" }}>
                <div className="d-flex justify-content-between">
                    <h4><i className="far fa-user mr-1"></i>{this.state.profile.nickname}</h4>
                    <h5><i className="far fa-clock mr-1"></i>{this.state.jpclock_str}</h5>
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
                                <input type="file" className="d-none" value=""
                                    onChange={(evt) => { this.setState({ tmpfile: evt.target.files[0] }) }} />
                                <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                                {this.state.tmpfile == null ? "Non selected" : this.state.tmpfile.name}
                            </button>
                            <button className="btn btn-primary btn-sm mx-1"
                                onClick={() => { this.dbC_addremark(); this.setState({ tmpcontent: "", tmpfile: null }); }}>
                                <i className="far fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>Remark
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="p-2 bg-light">
                <div className="d-flex justify-content-between">
                    <h3 style={{ fontFamily: "Century", color: "mediumturquoise" }}>TPTEF: Chatroom</h3>
                    <h3 style={{ color: "black" }}>{this.state.room}</h3>
                    <div className="form-inline">
                        <input className="form-control form-control-sm" type="text" value={this.state.tmproom}
                            onChange={(evt) => { this.setState({ tmproom: evt.target.value }) }} />
                        <button className="btn btn-success btn-sm"
                            onClick={(evt) => { this.setState({ room: this.state.tmproom }) }}>
                            <i className="fas fa-search mr-1" style={{ pointerEvents: "none" }}></i>Room
                        </button>
                    </div>
                </div>
                {this.render_thread_table()}
                {this.state.uid == "" ?
                    <h5 className="d-flex justify-content-center">
                        <i className="fas fa-wind mr-1"></i>Plz login
                    </h5>
                    :
                    this.render_submit_forms()
                }
            </div>
        );
    };
};
