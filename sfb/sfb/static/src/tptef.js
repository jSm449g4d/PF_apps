//plz use react-bootstrap and Firebase

class Tstreact extends React.Component {
    rerender() {
        this.setState({ shows: !this.state.shows });
    }

    create_acc() {
        firebase.auth().createUserWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch(function (error) {
            alert("error_code:" + error.code + "\nerror_message:" + error.message)
        })
    }
    signin() {
        firebase.auth().signInWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch(function (error) {
            alert("error_code:" + error.code + "\nerror_message:" + error.message)
        })
    }

    handleChange(e) {
        let name = e.target.name;
        this.setState({ [name]: e.target.value })
    }

    constructor(props) {
        super(props);
        this.state = { shows: false, mail_addr: "", mail_pass: "" };
        this.handleChange = this.handleChange.bind(this);
        this.signin = this.signin.bind(this);
        this.create_acc = this.create_acc.bind(this);
    };

    render() {
        var user = firebase.auth().currentUser
        return (
            <div class="">
                {firebase.auth().currentUser ?
                    <div>
                        <h6>ログイン済です</h6>
                        <p>Name:{user.displayName} mail:{user.email} </p>
                        <input type="button" value="logout" class="btn btn-success" onClick={function () { firebase.auth().signOut(); }} />
                    </div>
                    :
                    <div>
                        <h6>サービスを利用するには、ログインしてください</h6>
                        <input type="button" value="Google" class="btn btn-success mx-1"
                            onClick={function () {
                                var provider = new firebase.auth.GoogleAuthProvider();
                                firebase.auth().signInWithPopup(provider).then(function (result) { }).catch(function (error) { });
                            }} />
                        <input type="button" value="Guest" class="btn btn-success mx-1"
                            onClick={function () { firebase.auth().signInAnonymously() }} />
                        <button type="button" class="btn btn-success mx-1" data-toggle="modal" data-target="#Modal_signin">
                            Sign_in
                        </button>
                        <div class="modal fade" id="Modal_signin" role="dialog" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Sign in</h5>
                                    </div>
                                    <div class="modal-body">
                                        <input type="text" name="mail_addr" class="form-control m-1" placeholder="mail_address" onChange={this.handleChange} />
                                        <input type="text" name="mail_pass" class="form-control m-1" placeholder="set_password" onChange={this.handleChange} />
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.signin}>Submit</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn btn-success mx-1" data-toggle="modal" data-target="#Modal_create_acc">
                            Create_account
                        </button>
                        <div class="modal fade" id="Modal_create_acc" role="dialog" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Create account</h5>
                                    </div>
                                    <div class="modal-body">
                                        <input type="text" name="mail_addr" class="form-control m-1" placeholder="mail_address" onChange={this.handleChange} />
                                        <input type="text" name="mail_pass" class="form-control m-1" placeholder="set_password" onChange={this.handleChange} />
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.create_acc}>Submit</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
};
//
function renders() {
    ReactDOM.render(
        <Tstreact />, document.getElementById('davra'))
}
setInterval(renders, 500);
