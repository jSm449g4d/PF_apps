//plz use react-bootstrap and Firebase

class Account_tag extends React.Component {
    signup() {
        auth.createUserWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
        )
    }
    signin() {
        auth.signInWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
        )
    }
    pass_reset() {
        auth.sendPasswordResetEmail(this.state.mail_addr).then(() => {
            alert("SEND_EMAIL!")
        }).catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
        );
    }
    account_delete() {
        auth.currentUser.delete().then(() => {
            alert("ACCOUNT_DELETED!")
        }).catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
        );
    }
    signin_easy() {
        auth.signInWithEmailAndPassword("a@b.com", "asdfgh").catch(() => {
            auth.createUserWithEmailAndPassword("a@b.com", "asdfgh").catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
            )
        })
    }
    google_login() {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then().catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message); })
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    constructor(props) {
        super(props);
        this.state = { uid: "", mail_addr: "", mail_pass: "" };
        this.handleChange = this.handleChange.bind(this);
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid })
            }
            else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 100)
    };

    accountmodal_render(title, func) {
        let modal_id = "mygape_modal_" + title;
        let modal_id_s = "#" + modal_id;
        func = func.bind(this)
        return (
            <div>
                <button type="button" class="btn btn-primary btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>{title}</button>
                <div class="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">{title}</h5>
                            </div>
                            <div class="modal-body row">
                                <input type="text" name="mail_addr" class="form-control col-6" placeholder="mail_address" onChange={this.handleChange} />
                                <input type="text" name="mail_pass" class="form-control col-6" placeholder="set_password" onChange={this.handleChange} />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={func}>Submit</button>
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
            <div class=""><nav class="navbar navbar-expand-lg navbar-light bg-light">
                {this.state.uid != "" ?
                    <div class="navber-brand navbar-left form-inline">
                        <div>{auth.currentUser.photoURL ?
                            <div><img src={auth.currentUser.photoURL} alt="user.photoURL" border="1" width="64" height="64" /></div> : <div></div>}
                            {auth.currentUser.displayName ?
                                <div>ようこそ {auth.currentUser.displayName} さん</div> : <div>ようこそ {auth.currentUser.email} さん</div>}
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm mx-1" onClick={() => { firebase.auth().signOut(); }}>logout</button>
                        <button type="button" class="btn btn-warning btn-sm mx-1" data-toggle="modal" data-target="#account_modal_config">config</button>
                        <div class="modal fade" id="account_modal_config" role="dialog" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Config</h5>
                                    </div>
                                    <div class="modal-body row">
                                        <input type="text" name="mail_addr" class="form-control col-12" placeholder="send mail for password_reset" onChange={this.handleChange} />
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
                                <input type="button" value="Googleでログイン" class="btn btn-success mx-1 btn-sm" onClick={this.google_login} />
                            {this.accountmodal_render("Sign_in", this.signin)}
                            {this.accountmodal_render("Sign_up", this.signup)}
                            <button type="button" class="btn btn-warning mx-1 btn-sm" onClick={this.signin_easy}>Easy_login</button>
                        </div>
                    </div>
                }
            </nav></div>

        );
    };
};

ReactDOM.render(
    <Account_tag />, document.getElementById('account_tag'))
