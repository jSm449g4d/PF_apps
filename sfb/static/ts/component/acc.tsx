//plz use react-bootstrap and Firebase

import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Nav, NavItem, Navbar, Row, Col } from "react-bootstrap";
/*
import * as firebase from 'firebase/app';
import "firebase/auth";
*/
import * as firebase from 'firebase/app';
import "firebase/auth";
firebase.initializeApp({
    apiKey: "AIzaSyCWzFat3oUpn_4TtOpDCMhcOD2Qf4u1Mr4",
    authDomain: "crack-atlas-251509.firebaseapp.com",
    databaseURL: "https://crack-atlas-251509.firebaseio.com",
    projectId: "crack-atlas-251509",
    storageBucket: "crack-atlas-251509.appspot.com",
    messagingSenderId: "646437940818",
    appId: "1:646437940818:web:080ff48019a68c74d3b98b",
    measurementId: "G-QLHKJ38SWW"
})

// Initialize Firebase
firebase.analytics();
var auth = firebase.auth();
auth.onAuthStateChanged((user) => {
    if (user) {
        user.getIdToken(true).then((idToken) => {
            document.getElementsByName("fbtoken")[0].setAttribute("value", idToken);
        })
    } else {
        document.getElementsByName("fbtoken")[0].setAttribute("value", "");
    }
})
/**/
export interface Props { auth: null; }
interface State {
    uid: "", mail_addr: "", mail_pass: "";
}

export class Acc extends React.Component<{}, State> {
    //    signup() {
    //        auth.createUserWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
    //        )
    //    }
    render() {
        return <div className="bg-light p-2">acc</div>;
    }

}

//ReactDOM.render(<Acc />, document.getElementById("acc"));
