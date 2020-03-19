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
            this.load_profile()
        }
    }

    constructor(props) {
        super(props);
        this.state = { uid: "" };
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid })
            }
            else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 100)
    };

    changebutton_render(title, state_element) {
        let modal_id = "mygape_modal_" + title;
        let modal_id_s = "#" + modal_id;
        function changes(e) {
            this.setState({ [state_element]: e.target.value })
        }; changes = changes.bind(this);
        this.update_profile = this.update_profile.bind(this)
        return (
            <div>
                <button type="button" class="btn btn-outline-success btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>change</button>
                <div class="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">{title}</h5>
                            </div>
                            <div class="modal-body row">
                                    <textarea class="form-control col-12" rows="6" value={this.state[state_element]} onChange={changes} />

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
    //<input type="text" name="mail_addr" class="form-control m-1" value={this.state[state_element]} onChange={changes} />
    render() {
        return (
            <div>
                {this.state.uid != "" ?
                    <div>
                        <h3 class="form-inline">{this.state.nickname}{this.changebutton_render("nickname", "nickname")}</h3>
                        <h5 class="form-inline">{this.state.pr}{this.changebutton_render("PR", "pr")}</h5>
                        <h5 class="form-inline">{this.state.timestamp}{this.changebutton_render("Timestamp", "timestamp")}</h5>
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
