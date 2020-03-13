//plz use React and Firebase

const customStyles = {
    content: {
        background:brack
    }
};

function Popmaillogin() {
    return (
        <div>
        <input type="button" value="auth_google" class="btn btn-success" onclick="auth_google();" />
        <input type="button" value="auth_guest" class="btn btn-success" onclick="auth_guest();" />
        <input type="button" value="auth_mail" class="btn btn-success" onclick="auth_mail();" />
        <input type="button" value="auth_mail_add" class="btn btn-success" onclick="auth_mail_add();" />
        <input type="button" value="logout" class="btn btn-success" onclick="auth_logout();" />
        </div>
    )
}

class Tstreact extends React.Component {

    handleSubmit(event) {
        this.setState({
            showPopup: !this.state.showPopup
        });
    };

    constructor(props) {
        super(props);
        this.state = { value: 'SUBmit', showPopup: false };
    };
    render() {
        user=firebase.auth().currentUser
        if (user) {
            return (
                <div>
                <input type="button" value="auth_google" class="btn btn-success" onclick="auth_google();" />
                <input type="button" value="auth_guest" class="btn btn-success" onclick="auth_guest();" />
                <input type="button" value="auth_mail" class="btn btn-success" onclick="auth_mail();" />
                <input type="button" value="auth_mail_add" class="btn btn-success" onclick="auth_mail_add();" />
                </div>
                )

        } else {
            return (
                <div>
                <input type="button" value="logout" class="btn btn-success" onclick="auth_logout();" />
                </div>
                )
        }


        
        return (<p>
            <label>
                Name:
                </label>
            <input type="button" class="btn btn-success mx-1" value={this.state.value} onClick={this.handleSubmit.bind(this)} />
            {this.state.showPopup ?
                <Popmaillogin text='Close Me' closePopup={this.handleSubmit.bind(this)} />
                : null}
        </p>
        );

    }
};
ReactDOM.render(
    <Tstreact />, document.getElementById('davra'));
