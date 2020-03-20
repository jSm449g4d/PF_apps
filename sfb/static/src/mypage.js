//plz use react-bootstrap and Firebase

class Mypage_tag extends React.Component {

    load_profile() {
        if (this.state.uid == "") return;
        var docRef = db.collection("mypage").doc(this.state.uid);
        docRef.get().then((doc) => {
            let profile = JSON.parse(JSON.stringify(this.state)); delete profile["uid"];
            if (!doc.exists) {
                docRef.set(profile);
                this.setState(profile);
            }
            else {
                this.setState(doc.data());
            }
        });
    }

    update_profile() {
        if (this.state.uid == "") return;
        var docRef = db.collection("mypage").doc(this.state.uid);
        docRef.get().then((doc) => {
            let profile = JSON.parse(JSON.stringify(this.state)); delete profile["uid"];
            if (doc.exists) {
                docRef.set(profile);
            }
        });
    }

    componentDidMount() {
        this.load_profile()
        this.setState({
            nickname: "窓の民は名無し",
            pr: "私はJhon_Doe。窓の蛇遣いです。",
            accessed_by: "FB",
            timestamp: new Date().getTime()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.uid != prevState.uid) {
            this.load_profile();
        }
    }

    constructor(props) {
        super(props);
        this.state = { uid: "", image_url: "no image" };
        this.update_profile = this.update_profile.bind(this)
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            }
            else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 100)
    };

    changebutton_render(title, state_element) {
        let modal_id = "mygape_modal_" + title; let modal_id_s = "#" + modal_id;
        return (
            <div class="">
                <button type="button" class="btn btn-outline-success btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>change</button>
                <div class="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">{title}</h5>
                            </div>
                            <div class="modal-body row">
                                <textarea class="form-control col-12" rows="6" value={this.state[state_element]} onChange={
                                    (evt) => { this.setState({ [state_element]: evt.target.value }); }} />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={this.update_profile}>SUBMIT</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    //custom-file custom-file-input
    display_data() {
        let storageRef = storage.ref("mypage/" + this.state.uid + "/icon.img");
        storageRef.getDownloadURL().then((url) => {
            if (this.state.image_url != url) this.setState({ image_url: url });
        }).catch(() => { if (this.state.image_url != url) this.setState({ image_url: "no image" }); })
        return (
            <div>
                <img src={this.state.image_url} alt={this.state.image_url} border="1" width="128" height="128" />
                <button type="button" class="btn btn-outline-success btn-sm" onClick={() => {
                    $(event.target).children()[0].click();
                }}>Upload_Icon
                <input type="file" class="d-none" onChange={(evt) => {
                        if (window.confirm('Are you really submitting?\n' + evt.target.files[0].name)) {
                            storageRef.put(evt.target.files[0]);
                        }; this.setState({});
                    }} accept="image/jpeg,image/png" /></button>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.uid != "" ?
                    <div>
                        <h5 class="form-inline">{this.state.nickname}{this.changebutton_render("nickname", "nickname")}</h5>
                        <div>{this.display_data()}</div>
                        <h5 class="form-inline">{this.state.pr}{this.changebutton_render("PR", "pr")}</h5>
                        <h5 class="form-inline">{this.state.timestamp}</h5>
                    </div>
                    :
                    <h4>This application cant use without login</h4>
                }
            </div>
        );
    };
};
ReactDOM.render(
    <Mypage_tag />, document.getElementById('mypage_tag'))
