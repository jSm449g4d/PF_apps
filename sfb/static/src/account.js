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
        this.state = { shows: false, mail_addr: "", mail_pass: "" };
        this.handleChange = this.handleChange.bind(this);
        this.signin = this.signin.bind(this);
        this.create_account = this.create_account.bind(this);
    };

    render() {
        var user = firebase.auth().currentUser
        return (
            <div class=""><nav class="navbar navbar-expand-lg navbar-light bg-light">
                {firebase.auth().currentUser ?
                    <div class="navber-brand navbar-left">
                        {user.displayName ?
                            <h6>ようこそ {user.displayName} さん</h6> : <h6>ようこそ {user.email} さん</h6>}
                        <input type="button" value="logout" class="btn btn-success btn-sm" onClick={function () { firebase.auth().signOut(); }} />
                    </div>
                    :
                    <div class="navber-brand">
                        <div class="navbar-right">サービスを利用するには、ログインしてください</div>
                        <div class="form-inline">
                            <input type="button" value="Googleでログイン" class="btn btn-success mx-1 btn-sm"
                                onClick={function () {
                                    var provider = new firebase.auth.GoogleAuthProvider();
                                    firebase.auth().signInWithPopup(provider).then(function (result) { }).catch(function (error) { });
                                }} />
                            <input type="button" value="Create_account" class="btn btn-success mx-1 btn-sm" data-toggle="modal" data-target="#Modal_create_acc" />
                            <input type="button" value="Sign_in" class="btn btn-success mx-1 btn-sm" data-toggle="modal" data-target="#Modal_signin" />
                            <input type="button" value="Easy_login" class="btn btn-warning mx-1 btn-sm" onClick={this.signin_easy} />

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
                                            <button type="button" class="btn btn-warning" data-dismiss="modal" onClick={this.signin_easy}>Easy_login</button>
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

        )
    }
};
//
function renders() {
    ReactDOM.render(
        <Account_tag />, document.getElementById('account_tag'))
}
setInterval(renders, 200);
