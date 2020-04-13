import React from 'react';
import ReactDOM from "react-dom";
import { Account_tsx, auth, fb } from "./component/account";

const storage = fb.storage();
const db = fb.firestore()

interface State {
    uid: string, image_url: string, nickname: string, pr: string, accessed_by: string,
    [key: string]: string;
}


export class Mypage_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", image_url: "No_Image",
            nickname: "窓の民は名無し",
            pr: "私はJhon_Doe。窓の蛇遣いです。",
            accessed_by: "FB",
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
        this.db_CLud_loadpf.bind(this);
    }
    componentDidUpdate(prevProps: object, prevState: State) {
        if (this.state.uid != prevState.uid) {
            this.db_CLud_loadpf.bind(this)();
        }
    }

    //functions
    db_CLud_loadpf() {
        if (this.state.uid == "") return;
        const docRef = db.doc("mypage/" + this.state.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                this.setState(doc.data());
            }
            else {
                let tmp_profile = JSON.parse(JSON.stringify(this.state)); delete tmp_profile["uid"];
                docRef.set(tmp_profile);
                this.setState(tmp_profile);
            }
        });
    }
    db_Clud_setpf() {
        if (this.state.uid == "") return;
        let tmp_profile = JSON.parse(JSON.stringify(this.state)); delete tmp_profile["uid"];
        db.doc("mypage/" + this.state.uid).set(tmp_profile, { merge: true });
    }
    icon_download() {
        const storageRef = storage.ref("mypage/" + this.state.uid + "/icon.img");
        storageRef.getDownloadURL().then((url) => {
            if (this.state.image_url != url) this.setState({ image_url: url });
        }).catch(() => { if (this.state.image_url != "no image") this.setState({ image_url: "No_Image" }); })
        return (
            <div>
                <img src={this.state.image_url} alt={this.state.image_url} width="200" height="200" />
            </div>
        )
    }
    icon_upload() {
        let storageRef = storage.ref("mypage/" + this.state.uid + "/icon.img");
        return (
            <div>
                <button type="button" className="btn btn-outline-success btn-sm" onClick={(evt) => {
                    $(evt.currentTarget.children[0]).click()
                }}>Upload_Icon
                <input type="file" className="d-none" onChange={(evt) => {
                        if (window.confirm('Are you really submitting?\n' + evt.target.files[0].name)) {
                            storageRef.put(evt.target.files[0]);
                        }; this.setState({});
                    }} accept="image/jpeg,image/png" /></button>
            </div>
        )
    }

    //renders
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
                                <textarea className="form-control col-12" value={this.state[state_element]} onChange={
                                    (evt) => { this.setState({ [state_element]: evt.target.value }); }} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-success" data-dismiss="modal"
                                    onClick={() => { this.db_Clud_setpf() }}>SUBMIT</button>
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
                                <div>{this.state.nickname}</div>
                                <div className="ml-auto">
                                    <div className="form-inline">
                                        {this.render_changebutton("nickname", "nickname")}{this.icon_upload()}
                                    </div>
                                </div>
                            </h4>
                            <div className="d-flex">
                                <div className="">{this.icon_download()}</div>
                                <div className="bg-light m-1">
                                    <div className="d-flex justify-content-between bg-white m-1">
                                        <h5 className="">PR</h5>
                                        <div className="ml-auto">{this.render_changebutton("PR", "pr")}</div>
                                    </div>
                                    <h6 className="">{this.state.pr}</h6>
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

ReactDOM.render(
    <Mypage_tsx />,
    document.getElementById("mypage_tsx")
);

