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
        const modal_id: string = title + "_modal";
        func = func.bind(this)
        return (
            <div>
                <button type="button" className="btn btn-primary btn-sm mx-1" data-toggle="modal" data-target={"#" + modal_id}>{title}</button>
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
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    <i className="fas fa-caret-up mr-1"></i>Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={func}>
                                    <i className="fas fa-paper-plane mr-1"></i>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render_displayaccount() {
        return (
            <div className="form-inline">{auth.currentUser.photoURL ?
                <img className="mr-2" src={auth.currentUser.photoURL} alt="user.photoURL" width="48" height="48" /> :
                <i className="fas fa-signature fa-lg mr-2"></i>}
                {auth.currentUser.displayName ?
                    <h5>ようこそ <i className="fas fa-envelope mr-1"></i>{auth.currentUser.displayName} さん</h5> :
                    <h5>ようこそ <i className="far fa-envelope mr-1"></i>{auth.currentUser.email} さん</h5>}
            </div>
        )
    }
    render() {
        return (
            <div className="bg-light p-2">
                {this.state.uid == "" ?
                    <div className="d-flex justify-content-between">
                        <h5><i className="fas fa-wind mr-1"></i>サービスを利用するには、ログインしてください</h5>
                        <div className="ml-auto">
                            <div className="form-inline">
                                <button className="btn btn-success mx-1 btn-sm" type="button" onClick={() => { this.auth_glogin() }}>
                                    <i className="fab fa-google mr-1"></i>Googleでログイン</button>
                                {this.render_account_modal("Sign_in", this.auth_signin)}
                                {this.render_account_modal("Sign_up", this.auth_signup)}
                                <button className="btn btn-warning mx-1 btn-sm" type="button" onClick={() => { this.auth_easyin() }}>
                                    <i className="fas fa-sign-in-alt mr-1"></i>Easy_login</button>
                                <button className="btn btn-warning mx-1 btn-sm" type="button" onClick={() => { this.auth_easyin2() }}>
                                    <i className="fas fa-sign-in-alt mr-1"></i>別垢版</button>
                            </div>
                        </div>
                    </div> :
                    <div className="d-flex justify-content-between">
                        {this.render_displayaccount()}
                        <div className="form-inline">
                            <button className="btn btn-secondary btn-sm mx-1" type="button" onClick={() => { auth.signOut(); }}>
                                <i className="fas fa-sign-out-alt mr-1"></i>logout</button>
                            <i className="fas fa-cog fa-lg faa-wrench animated-hover mx-1" data-toggle="modal" data-target="#config_modal" />
                            <div className="modal fade" id="config_modal" role="dialog" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title"><i className="fas fa-cog mr-1"></i>Config</h5>
                                        </div>
                                        <div className="modal-body form-inline">
                                            <input className="form-control" type="text" name="mail_addr" size={40} placeholder="mail address" />
                                            <button className="btn btn-sm btn-warning m-2" type="button" data-dismiss="modal" onClick={() => { this.auth_resetpass(); }}>
                                                <i className="fas fa-paper-plane mr-1"></i>RESRT</button>
                                        </div>
                                        <div className="modal-footer d-flex justify-content-start">
                                            <div className="flex-grow-1"><button className="btn btn-secondary" type="button" data-dismiss="modal">
                                                <i className="fas fa-caret-up mr-1"></i>Close</button></div>
                                            <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal" onClick={() => { this.auth_deluser(); }}>
                                                <i className="fas fa-user-slash mr-1"></i>USER_DELETE</button>
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
