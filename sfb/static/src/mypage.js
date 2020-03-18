//plz use react-bootstrap and Firebase

class Mypage_tag extends React.Component {
    load_profile() {
        if (this.state.uid != "") {
            var docRef = db.collection("mypage").doc(this.state.uid);
            docRef.get().then((doc) => {
                var profile = JSON.stringify(this.state); profile = JSON.parse(profile); delete profile["uid"];
                if (!doc.exists) {
                    docRef.set(profile);
                    this.setState(profile);
                }
                else {
                    this.setState(doc.data());
                }
            });
        }
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
                if (this.state.uid !="") this.setState({ uid: "" });
            }
        }, 100)
    };
    rec(as) { alert(as) }

    changebutton_render(title,name, func) {
        var modal_id = "mygape_modal_" + name;
        var modal_id_s = "#"+modal_id;
        var handlename = ""
        function changes(e) {
            handlename = e.target.value;
        }
        function submit() {
            func(handlename)
        }
        return (
            <div>
                <button type="button" class="btn btn-outline-success btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>change</button>
                <div class="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">{title}</h5>
                            </div>
                            <div class="modal-body">
                                <input type="text" name="mail_addr" class="form-control m-1" placeholder="send mail for password_reset" onChange={changes} />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" onClick={submit}>SUBMIT</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
                {this.state.uid != "" ?
                    <div>
                        <h3 class="form-inline">{this.state.nickname}{this.changebutton_render("nickname",this.state.nickname, this.rec)}</h3>
                        <h5 class="form-inline">{this.state.pr}{this.changebutton_render("PR",this.state.pr, this.rec)}</h5>
                        <h5 class="form-inline">{this.state.timestamp}{this.changebutton_render("Timestamp",this.state.timestamp, this.rec)}</h5>
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
