import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb, fb_errmsg } from "./component/account";
import { stopf5, Query2Dict, Dict2Query } from "./component/util_tsx";

const storage = fb.storage();
const db = fb.firestore()

interface State {
    uid: string; unsnaps: any; icon_url: string;
    profile: { [keys: string]: string };
}

// Query2Dict():{showuid:string,}

export class Mypage_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", unsnaps: [],
            icon_url: "",
            profile: {},
        };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.uid != prevState.uid) {
            for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
            this.setState({ unsnaps: [this.db_Rwd_getpf.bind(this)(),] })
        }
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    //functions
    db_Rwd_getpf() {
        if (Query2Dict()["showuid"] == "") return () => { };
        return db.doc("mypage/" + Query2Dict()["showuid"]).onSnapshot((doc) => {
            if (doc.exists) {
                const tmp_recodes = doc.data()
                const tsuids = Object.keys(tmp_recodes).sort()
                this.setState({ profile: Object.assign(Object.assign(this.state.profile), tmp_recodes[tsuids[0]]) });
                this.storage_Rwd_icon.bind(this)();
            }
            else { this.setState({ profile: {} }); }
        });
    }
    db_rWd_setpf() {
        if (Query2Dict()["showuid"] == "") return;
        if (Query2Dict()["showuid"] != this.state.uid) return;
        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
        db.doc("mypage/" + Query2Dict()["showuid"]).set({
            [Date.now().toString() + "_" + Query2Dict()["showuid"]]: this.state.profile
        }).catch((err) => { fb_errmsg(err) })
    }
    db_rWd_makepf() {
        if (Query2Dict()["showuid"] == "") return;
        if (Query2Dict()["showuid"] != this.state.uid) return;
        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
        db.doc("mypage/" + Query2Dict()["showuid"]).set({
            [Date.now().toString() + "_" + Query2Dict()["showuid"]]:
                { nickname: "窓の民は名無し", pr: "私はJhon_Doe。窓の蛇遣いです。" }
        }).catch((err) => { fb_errmsg(err) })
    }
    storage_Rwd_icon() {
        if (Query2Dict()["showuid"] == "") return;
        storage.ref("mypage/" + Query2Dict()["showuid"] + "/icon.img").getDownloadURL().then((url) => {
            if (this.state.icon_url != url) this.setState({ icon_url: url });
        }).catch(() => { if (this.state.icon_url != "") this.setState({ icon_url: "" }); })
    }
    storage_rWd_icon(upload_file: any) {
        if (Query2Dict()["showuid"] == "") return;
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq access
        storage.ref("mypage/" + Query2Dict()["showuid"] + "/icon.img").put(upload_file);
        setTimeout(() => { this.storage_Rwd_icon() }, 1000)
    }
    _gotomypage() {
        window.location.search = Dict2Query(Object.assign(Query2Dict(), { showuid: this.state.uid }))
    }

    //renders
    render_dlicon() {
        if (this.state.icon_url == "") { return (<div>No Image</div>) }
        return (<div><img src={this.state.icon_url} alt={this.state.icon_url} width="156" height="156" /></div>)
    }
    render_upicon() {
        if (Query2Dict()["showuid"] != this.state.uid) return;
        return (
            <button type="button" className="btn btn-outline-success btn-sm m-1" onClick={
                (evt) => { $(evt.currentTarget.children[0]).click() }}>
                Change_Icon
                <input type="file" className="d-none" onChange={
                    (evt) => { this.storage_rWd_icon(evt.target.files[0]) }} accept="image/jpeg,image/png" />
            </button>
        )
    }
    render_changebutton(title: string, state_element: string) {
        if (Query2Dict()["showuid"] != this.state.uid) return;
        let modal_id = "mygape_modal_" + title; let modal_id_s = "#" + modal_id;
        return (
            <div>
                <button type="button" className="btn btn-outline-success btn-sm m-1" data-toggle="modal" data-target={modal_id_s}>
                    Change_{title}
                </button>
                <div className="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                            </div>
                            <div className="modal-body row">
                                <textarea className="form-control col-12" value={this.state.profile[state_element]} onChange={
                                    (evt) => {
                                        let tmp_profile = Object.assign(this.state.profile)
                                        tmp_profile[state_element] = evt.target.value
                                        this.setState({ profile: tmp_profile });
                                    }} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-success" data-dismiss="modal"
                                    onClick={() => { this.db_rWd_setpf() }}>SUBMIT</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div>{"showuid" in Query2Dict() == false ?
                setTimeout(() => { this._gotomypage() }, 1000)
                : <div>
                    {"nickname" in this.state.profile == false ?
                        <div>
                            <button type="button" className="btn btn-outline-success btn-bg m-2"
                                onClick={() => { this.db_rWd_makepf() }}>Create Mypage</button>
                        </div>
                        :
                        <div className="m-2" style={{ background: "khaki" }}>
                            <div className="d-flex justify-content-start">
                                <div className="m-1">{this.render_dlicon()}</div>
                                <div className="m-1 p-1 flex-grow-1" style={{ backgroundColor: "rgba(100,100,100,0.1)" }}>
                                    <div className="d-flex justify-content-start">
                                        <h3 className="flex-grow-1">{this.state.profile["nickname"]}</h3>
                                        <div className="form-inline">
                                            {this.render_changebutton("Nickname", "nickname")}{this.render_upicon()}
                                        </div>
                                    </div>
                                    <div className="m-1 p-1" style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
                                        <div className="d-flex justify-content-between">
                                            <h5>PR</h5>
                                            <div className="">{this.render_changebutton("PR", "pr")}</div>
                                        </div>
                                        <div>{this.state.profile["pr"]}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }<button type="button" className="btn btn-outline-success btn-sm m-2"
                        onClick={() => { this._gotomypage() }}>Mypage</button>
                </div>
            }</div>
        );
    };
};

document.body.insertAdjacentHTML('afterbegin', '<div id="app_tsx">app_tsx loading...<\/div>');
document.body.insertAdjacentHTML('afterbegin', '<div id="account_tsx">account_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
ReactDOM.render(<Mypage_tsx />, document.getElementById("app_tsx"));
