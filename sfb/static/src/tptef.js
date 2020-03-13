//plz use react-bootstrap and Firebase

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCWzFat3oUpn_4TtOpDCMhcOD2Qf4u1Mr4",
    authDomain: "crack-atlas-251509.firebaseapp.com",
    databaseURL: "https://crack-atlas-251509.firebaseio.com",
    projectId: "crack-atlas-251509",
    storageBucket: "crack-atlas-251509.appspot.com",
    messagingSenderId: "646437940818",
    appId: "1:646437940818:web:080ff48019a68c74d3b98b",
    measurementId: "G-QLHKJ38SWW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function auth_google() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) { }).catch(function (error) { });
}

function auth_guest() {
    firebase.auth().signInAnonymously();
}

function auth_mail() {
    firebase.auth().signInWithEmailAndPassword("test@gmail.com", "password").catch(function (error) {
        document.getElementById("authdoc").innerHTML += error.code + "<br>"
        document.getElementById("authdoc").innerHTML += error.message + "<br>"
    });
}

function auth_mail_add() {
    firebase.auth().createUserWithEmailAndPassword("test@gmail.com", "password").catch(function (error) {
        document.getElementById("authdoc").innerHTML += error.code + "<br>"
        document.getElementById("authdoc").innerHTML += error.message + "<br>"
    })
    document.getElementById("authdoc").innerHTML += firebase.auth().currentUser
}

function auth_logout() {
    firebase.auth().signOut();
    var cx = document.getElementById("fbtoken");
    cx.value = "";
}

firebase.auth().onAuthStateChanged(function (user) { //Firebase_token_keep
    firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
        var cx = document.getElementById("fbtoken");
        cx.value = idToken;
    })
})


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
        var user = firebase.auth().currentUser;
        if (user) {
            return (
                <div>
                    <input type="button" value="logout" class="btn btn-success" onclick={auth_logout} />
                </div>
            )
        } else {
            return (
                <div>
                    <input type="button" value="auth_google" class="btn btn-success" onclick={auth_google} />
                    <input type="button" value="auth_guest" class="btn btn-success" onclick={auth_guest} />
                    <input type="button" value="auth_mail" class="btn btn-success" onclick={auth_mail} />
                    <input type="button" value="auth_mail_add" class="btn btn-success" onclick={auth_mail_add} />
                </div>
            )
        }
    }
};

ReactDOM.render(
    <Tstreact />, document.getElementById('davra'));
