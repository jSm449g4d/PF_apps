import React from 'react';

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

interface State {
    uid: string, mail_addr: string, mail_pass: string
}
export class Acc extends React.Component<{}, State> {
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

    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", mail_addr: "", mail_pass: ""
        };
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid })
            }
            else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 100)
    }


    accountmodal_render(title: string, func: any) {
        let modal_id = "mygape_modal_" + title; let modal_id_s = "#" + modal_id;
        func = func.bind(this)
        return (
            <div>
                <button type="button" className="btn btn-primary btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>{title}</button>
                <div className="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                            </div>
                            <div className="modal-body row">
                                <input type="text" name="mail_addr" className="form-control col-6" placeholder="mail_address"
                                    onChange={(evt: any) => { this.setState({ mail_addr: evt.target.value }); }} />
                                <input type="text" name="mail_pass" className="form-control col-6" placeholder="set_password"
                                    onChange={(evt: any) => { this.setState({ mail_pass: evt.target.value }); }} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={func}>Submit</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="bg-light p-2">
                {this.state.uid != "" ?
                    <div className="d-flex justify-content-between">
                        <div>{auth.currentUser.photoURL ?
                            <img src={auth.currentUser.photoURL} alt="user.photoURL" width="64" height="64" /> : <div />}
                            {auth.currentUser.displayName ?
                                <h6>ようこそ {auth.currentUser.displayName} さん</h6> : <h6>ようこそ {auth.currentUser.email} さん</h6>}
                        </div>
                        <div className="form-inline">
                            <button type="button" className="btn btn-secondary btn-sm mx-1" onClick={() => { auth.signOut(); }}>logout</button>
                            <button type="button" className="btn btn-warning btn-sm mx-1" data-toggle="modal" data-target="#account_modal_config">config</button>
                            <div className="modal fade" id="account_modal_config" role="dialog" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Config</h5>
                                        </div>
                                        <div className="modal-body row">
                                            <input type="text" name="mail_addr" className="form-control col-12" placeholder="send mail for password_reset" />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-sm btn-warning" data-dismiss="modal">password_reset</button>
                                            <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">account_delete</button>
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="d-flex justify-content-between">
                        <h5>サービスを利用するには、ログインしてください</h5>
                        <div className="ml-auto">
                            <div className="form-inline">
                                <input type="button" value="Googleでログイン" className="btn btn-success mx-1 btn-sm" onClick={this.google_login} />
                                {this.accountmodal_render("Sign_in", this.signin)}
                                {this.accountmodal_render("Sign_up", this.signup)}
                                <button type="button" className="btn btn-warning mx-1 btn-sm" onClick={this.signin_easy}>Easy_login</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

}
