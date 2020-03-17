//plz use react-bootstrap and Firebase



class Mypage_tag extends React.Component {
    load_profile() {
        if (this.state.uid != "") {
            var docRef = db.collection("mypage").doc(this.state.uid);
            docRef.get().then((doc) => {
                var profile = this.state; delete profile["uid"];
                if (!doc.exists) {
                    docRef.set(profile);
                    this.setState(profile);
                }
                else { this.setState(doc.data()); }
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
        if (this.state.uid != prevState.uid) { this.load_profile() }
    }

    constructor(props) {
        super(props);
        this.state = { uid: "" };
        setInterval(() => {
            if (firebase.auth().currentUser) {
                this.setState({ uid: auth.currentUser.uid });
            }
            else {
                this.setState({ uid: "" });
            }
        }, 100)
    };

    button_render(){
        return(
            <div>TTT</div>
        )
    }

    render() {
        return (
            <div>
                {this.state.uid != "" ?
                    <div>
                        <h3>{this.state.nickname}</h3>
                        <h5>{this.state.pr}</h5>
                        <h5>{this.state.timestamp}</h5>
                        <button type="button" class="btn btn-warning btn-sm mx-1" data-toggle="modal" data-target="#mygape_modal_test">Test</button>
                        {this.button_render}
                    </div>
                    :
                    <h4>This application cant use without login</h4>
                }

                <div class="modal fade" id="mygape_modal_test" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Config</h5>
                            </div>
                            <div class="modal-body">
                                <input type="text" name="mail_addr" class="form-control m-1" placeholder="send mail for password_reset" onChange={this.handleChange} />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">SUBMIT</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
ReactDOM.render(
    <Mypage_tag />, document.getElementById('mypage_tag'))
