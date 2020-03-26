//plz use react-bootstrap and Firebase

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import firebase from 'firebase/app';
import "firebase/analytics";
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
firebase.analytics();
let auth = firebase.auth();

interface Props {}
interface State {
    uid: string;
}
export class Acc extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            uid: '',
        };
    }
    //    signup() {
    //        auth.createUserWithEmailAndPassword(this.state.mail_addr, this.state.mail_pass).catch((error) => { alert("error_code:" + error.code + "\nerror_message:" + error.message) }
    //        )
    //    }{this.state.uid}
    render() {
        return <div className="bg-light p-2">acc:{this.state.uid} </div>;
    }

}

//ReactDOM.render(<Acc />, document.getElementById("acc"));
