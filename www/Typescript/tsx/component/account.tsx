import React from 'react';
import firebase from 'firebase/app';
import "firebase/analytics";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";


firebase.initializeApp({
    apiKey: "AIzaSyBnD6VYwD1fUwgNc9WYUFaYYa9goQNJu6A",
    authDomain: "fir-251509.firebaseapp.com",
    databaseURL: "https://fir-251509.firebaseio.com",
    projectId: "fir-251509",
    storageBucket: "fir-251509.appspot.com",
    messagingSenderId: "854391462599",
    appId: "1:854391462599:web:7cbbbd24e82fdb1b02fce2",
    measurementId: "G-4N2QE70XC1"
})

export const fb = firebase;
export const auth = firebase.auth();
fb.analytics();

export function fb_errmsg(error: any) { alert("error_code:" + error.code + "\nerror_message:" + error.message); }

interface State {
    uid: string, tmpaddr: string, tmppass: string
}
export class Account_tsx extends React.Component<{}, State> {
    //constructors
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", tmpaddr: "", tmppass: ""
        };
        setInterval(() => {
            if (auth.currentUser) { if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid }); }
            else { if (this.state.uid != "") this.setState({ uid: "" }); }
        }, 100)
    }

    //functions
    auth_signup(mail_addr: string = this.state.tmpaddr, mail_pass: string = this.state.tmppass) {
        auth.createUserWithEmailAndPassword(mail_addr, mail_pass).catch((err) => { fb_errmsg(err) })
    }
    auth_signin(mail_addr: string = this.state.tmpaddr, mail_pass: string = this.state.tmppass) {
        auth.signInWithEmailAndPassword(mail_addr, mail_pass).catch((err) => { fb_errmsg(err) })
    }
    auth_easyin(mail_addr: string = "a@b.com", mail_pass: string = "asdfgh") {
        auth.signInWithEmailAndPassword(mail_addr, mail_pass).catch(() => { this.auth_signup(mail_addr, mail_pass); })
    }
    auth_easyin2(mail_addr: string = "c@d.com", mail_pass: string = "asdfgh") {
        auth.signInWithEmailAndPassword(mail_addr, mail_pass).catch(() => { this.auth_signup(mail_addr, mail_pass); })
    }
    auth_resetpass(mail_addr: string = this.state.tmpaddr) {
        auth.sendPasswordResetEmail(mail_addr).then(() => { alert("SEND_EMAIL!") }).catch((err) => { fb_errmsg(err) });
    }
    auth_deluser() {
        if (window.confirm('Are you really DELETE:USER?\n')) {
            auth.currentUser.delete().then(() => { alert("ACCOUNT_DELETED!") }).catch((err) => { fb_errmsg(err) });
        }
    }
    auth_glogin() { auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch((err) => { fb_errmsg(err) }) }

    //renders
    render_account_modal(title: string, func: any) {
        let modal_id = "mygape_modal_" + title; let modal_id_s = "#" + modal_id;
        func = func.bind(this)
        return (
            <div>
                <button type="button" className="btn btn-primary btn-sm mx-1" data-toggle="modal" data-target={modal_id_s}>{title}</button>
                <div className="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                            </div>
                            <div className="modal-body">
                                <div><input className="form-control m-1" type="text" size={40} name="mail_addr" placeholder="mail_address"
                                    onChange={(evt: any) => { this.setState({ tmpaddr: evt.target.value }); }} /></div>
                                <div><input className="form-control m-1" type="text" size={40} name="mail_pass" placeholder="set_password"
                                    onChange={(evt: any) => { this.setState({ tmppass: evt.target.value }); }} /></div>
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
                {this.state.uid == "" ?
                    <div className="d-flex justify-content-between">
                        <h5>サービスを利用するには、ログインしてください</h5>
                        <div className="ml-auto">
                            <div className="form-inline">
                                <input type="button" value="Googleでログイン" className="btn btn-success mx-1 btn-sm" onClick={() => { this.auth_glogin() }} />
                                {this.render_account_modal("Sign_in", this.auth_signin)}
                                {this.render_account_modal("Sign_up", this.auth_signup)}
                                <button type="button" className="btn btn-warning mx-1 btn-sm" onClick={() => { this.auth_easyin() }}>Easy_login</button>
                                <button type="button" className="btn btn-warning mx-1 btn-sm" onClick={() => { this.auth_easyin2() }}>→別垢版</button>
                            </div>
                        </div>
                    </div> :
                    <div className="d-flex justify-content-between">
                        <div className="form-inline">{auth.currentUser.photoURL ?
                            <img src={auth.currentUser.photoURL} alt="user.photoURL" width="48" height="48" /> : <div />}
                            <div className="mx-4" />
                            {auth.currentUser.displayName ?
                                <h5>ようこそ {auth.currentUser.displayName} さん</h5> : <h5>ようこそ {auth.currentUser.email} さん</h5>}
                        </div>
                        <div className="form-inline">
                            <button type="button" className="btn btn-warning btn-sm mx-1" data-toggle="modal" data-target="#account_modal_config">config</button>
                            <button type="button" className="btn btn-secondary btn-sm mx-1" onClick={() => { auth.signOut(); }}>logout</button>
                            <div className="modal fade" id="account_modal_config" role="dialog" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Config</h5>
                                        </div>
                                        <div className="modal-body">
                                            <input type="text" name="mail_addr" className="form-control" size={40} placeholder="mail address" />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-sm btn-warning" data-dismiss="modal" onClick={() => { this.auth_resetpass(); }}>password_RESRT</button>
                                            <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal" onClick={() => { this.auth_deluser(); }}>USER_DELETE</button>
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

}
