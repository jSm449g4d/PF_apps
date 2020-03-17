//plz use react-bootstrap and Firebase

class Account_tag extends React.Component {
    create_account() {
        firebase.auth().createUserWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch(function (error) {
            alert("error_code:" + error.code + "\nerror_message:" + error.message)
        })
    }
    signin() {
        firebase.auth().signInWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch(function (error) {
            alert("error_code:" + error.code + "\nerror_message:" + error.message)
        })
    }
    pass_reset() {
        firebase.auth().sendPasswordResetEmail(this.state.mail_addr).then(() => {
            alert("SEND_EMAIL!")
        }).catch((error) => {
            alert("error_code:" + error.code + "\nerror_message:" + error.message);
        });
    }
    account_delete() {
        firebase.auth().currentUser.delete().then(() => {
            alert("ACCOUNT_DELETED!")
        }).catch(function (error) {
            alert("error_code:" + error.code + "\nerror_message:" + error.message);
        });
    }
    signin_easy() {
        firebase.auth().signInWithEmailAndPassword("a@b.com", "asdfgh").catch(function (_) {
            firebase.auth().createUserWithEmailAndPassword("a@b.com", "asdfgh").catch(function (error) {
                alert("error_code:" + error.code + "\nerror_message:" + error.message)
            })
        })
    }
    handleChange(e) {
        let name = e.target.name;
        this.setState({ [name]: e.target.value })
    }

    constructor(props) {
        super(props);
        this.state = { uid: "", mail_addr: "", mail_pass: "" };
        this.handleChange = this.handleChange.bind(this);
        this.signin = this.signin.bind(this);
        this.create_account = this.create_account.bind(this);
        setInterval(() => {
            if (firebase.auth().currentUser) {
                this.setState({ uid: firebase.auth().currentUser.uid });
            }
            else {
                this.setState({ uid: "" });
            }
        }, 100)
    };
    render() {
        var user = firebase.auth().currentUser
        return (
            <div class=""><nav class="navbar navbar-expand-lg navbar-light bg-light">
                {this.state.uid != "" ?
                    <div class="navber-brand navbar-left form-inline">
                        <div>{user.photoURL ?
                            <div><img src={user.photoURL} alt="user.photoURL" border="1" /></div> : <div></div>}
                            {user.displayName ?
                                <div>ようこそ {user.displayName} さん</div> : <div>ようこそ {user.email} さん</div>}
                        </div>
                        <button type="button" class="btn btn-success btn-sm mx-1" onClick={()=>{ firebase.auth().signOut(); }}>logout</button>
                        <button type="button" class="btn btn-warning btn-sm mx-1" data-toggle="modal" data-target="#Modal_config">config</button>
                        <div class="modal fade" id="Modal_config" role="dialog" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Config</h5>
                                    </div>
                                    <div class="modal-body">
                                        <input type="text" name="mail_addr" class="form-control m-1" placeholder="send mail for password_reset" onChange={this.handleChange} />
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-sm btn-warning" data-dismiss="modal" onClick={this.pass_reset}>password_reset</button>
                                        <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" onClick={this.account_delete}>account_delete</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div class="navber-brand">
                        <div class="navbar-right form-inline">サービスを利用するには、ログインしてください
                            <input type="button" value="Googleでログイン" class="btn btn-success mx-1 btn-sm"
                                onClick={function () {
                                    var provider = new firebase.auth.GoogleAuthProvider();
                                    firebase.auth().signInWithPopup(provider).then(function (result) { }).catch(function (error) { });
                                }} />
                            <button type="button" class="btn btn-success mx-1 btn-sm" data-toggle="modal" data-target="#Modal_create_acc">Create_account</button>
                            <button type="button" class="btn btn-success mx-1 btn-sm" data-toggle="modal" data-target="#Modal_signin">Sign_in</button>
                            <button type="button" class="btn btn-warning mx-1 btn-sm" onClick={this.signin_easy}>Easy_login</button>
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
                        </div>
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
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={this.create_account}>Submit</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </nav></div>
        );
    };
};

ReactDOM.render(
    <Account_tag />, document.getElementById('account_tag'))
