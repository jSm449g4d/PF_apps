import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb } from "./component/account";
import { stopf5 } from "./component/stopf5";

const storage = fb.storage();
const db = fb.firestore()

interface State {
    uid: string; unsnaps: any; image_url: string; profile: string
}


export class Mypage_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", unsnaps: [], image_url: "",
            profile: JSON.stringify({
                nickname: "窓の民は名無し", pr: "私はJhon_Doe。窓の蛇遣いです。", timestamp: Date.now(),
            }),
        };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 200)
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.uid != prevState.uid) {
            for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() }
            this.setState({ unsnaps: [this.db_Rwd_getprofile.bind(this)(),] })
        }
    }
    componentWillUnmount() { for (let i = 0; i < this.state.unsnaps.length; i++) { this.state.unsnaps[i]() } }

    //functions
    db_Rwd_getprofile() {
        if (this.state.uid == "") return () => { };
        return db.doc("mypage/" + this.state.uid).onSnapshot((doc) => {
            if (doc.exists) { this.setState({ profile: JSON.stringify(doc.data()) }); }
        });
    }
    db_rWd_setpf() {
        if (this.state.uid == "") return;
        if (stopf5.check("1", 500) == false) return; // To prevent high freq access
        db.doc("mypage/" + this.state.uid).set(JSON.parse(this.state.profile), { merge: true });
    }
    storage_rWd_icon(upload_file: any) {
        if (this.state.uid == "") return;
        if (stopf5.check("2", 500) == false) return; // To prevent high freq access
        storage.ref("mypage/" + this.state.uid + "/icon.img").put(upload_file);
    }
    storage_Rwd_icon() {
        if (stopf5.check("3", 500) == false) return; // To prevent high freq access
        storage.ref("mypage/" + this.state.uid + "/icon.img").getDownloadURL().then((url) => {
            if (this.state.image_url != url) this.setState({ image_url: url });
        }).catch(() => { if (this.state.image_url != "") this.setState({ image_url: "" }); })
    }

    //renders
    render_icon() {
        this.storage_Rwd_icon();
        if (this.state.image_url == "") { return (<div>No Image</div>) }
        return (<div><img src={this.state.image_url} alt={this.state.image_url} width="200" height="200" /></div>)
    }
    render_upicon() {
        return (
            <button type="button" className="btn btn-outline-success btn-sm" onClick={
                (evt) => { $(evt.currentTarget.children[0]).click() }}>
                Upload_Icon
                <input type="file" className="d-none" onChange={
                    (evt) => { this.storage_rWd_icon(evt.target.files[0]) }} accept="image/jpeg,image/png" />
            </button>
        )
    }
    render_changebutton(title: string, state_element: string) {
        let modal_id = "mygape_modal_" + title; let modal_id_s = "#" + modal_id;
        return (
            <div>
                <button type="button" className="btn btn-outline-success btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>change</button>
                <div className="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                            </div>
                            <div className="modal-body row">
                                <textarea className="form-control col-12" value={JSON.parse(this.state.profile)[state_element]} onChange={
                                    (evt) => {
                                        let tmp_profile_dict = JSON.parse(this.state.profile)
                                        tmp_profile_dict[state_element] = evt.target.value
                                        this.setState({ profile: JSON.stringify(tmp_profile_dict) });
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
            <div>
                {this.state.uid == "" ?
                    <h4 className="d-flex justify-content-center">This application cant use without login</h4> :
                    <div>
                        <div className="m-2 p-1" style={{ background: "khaki" }}>
                            <h4 className="d-flex justify-content-between">
                                <div>{JSON.parse(this.state.profile)["nickname"]}</div>
                                <div className="ml-auto">
                                    <div className="form-inline">
                                        {this.render_changebutton("nickname", "nickname")}{this.render_upicon()}
                                    </div>
                                </div>
                            </h4>
                            <div className="d-flex">
                                <div className="">{this.render_icon()}</div>
                                <div className="bg-light m-1">
                                    <div className="d-flex justify-content-between bg-white m-1">
                                        <h5 className="">PR</h5>
                                        <div className="ml-auto">{this.render_changebutton("PR", "pr")}</div>
                                    </div>
                                    <h6 className="">{JSON.parse(this.state.profile)["pr"]}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
};

const element: any = document.body
element.insertAdjacentHTML('beforebegin', '<div id="account_tsx">account_tsx loading...<\/div>');
element.insertAdjacentHTML('beforebegin', '<div id="mypage_tsx">mypage_tsx loading...<\/div>');

ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));
ReactDOM.render(<Mypage_tsx />, document.getElementById("mypage_tsx"));
