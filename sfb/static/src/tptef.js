//plz use react-bootstrap and Firebase

class Tstreact extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: 'SUBmit' };
    };
    render() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                return (
                    <div>
                        <input type="button" value="logout" class="btn btn-success" onClick={auth_logout} />
                    </div>
                )
            } else {
                return (
                    <div>
                        <input type="button" value="auth_google" class="btn btn-success" onClick={auth_google} />
                        <input type="button" value="auth_guest" class="btn btn-success" onClick={auth_guest} />
                        <input type="button" value="auth_mail" class="btn btn-success" onClick={auth_mail} />
                        <input type="button" value="auth_mail_add" class="btn btn-success" onClick={auth_mail_add} />
                    </div>
                )
            }
        });
    }
};

ReactDOM.render(
    <Tstreact />, document.getElementById('davra'));
