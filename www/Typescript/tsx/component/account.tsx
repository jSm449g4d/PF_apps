import React, { useState, useEffect, useReducer } from 'react';
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
const db = fb.firestore()
const storage = fb.storage();

fb.analytics();

export const fb_errmsg = (error: any) => { alert("error_code:" + error.code + "\nerror_message:" + error.message); }


export const useAuth = () => {
    const [uid, setUid] = useState("")
    const [useInterval, setUseInterval] = React.useState(new Date());    // FirebaseSnapping
    // setInterval(Auth)
    useEffect(() => {
        const _intervalId = setInterval(() => {
            // Auth
            if (auth.currentUser) { if (uid != auth.currentUser.uid) setUid(auth.currentUser.uid); }
            else { if (uid != "") setUid(""); }
            setUseInterval(new Date());
        }, 100);
        return () => { clearInterval(_intervalId) };
    }, [useInterval]);

    return [uid,]
}

// UC: studing Reducer
export const useDb = (dbName: string) => {
    function dbUriCheck(uri: String) {
        // schema1/ document → True
        // else → False
        const dirs: string[] = uri.split("/")
        if (dirs.length < 2) { return false; }
        for (let i = 0; i < dirs.length; i++) {
            if (dirs[i].length < 1) { return false; }
        }
        return true;
    }
    const [localDb, setLocalDb] = useState<{ [tptef: string]: any }>({})
    const dbCreate = (uri: string, margeFlag: boolean = false, ) => {
        if (dbUriCheck(uri) == false) return
        db.doc(uri).set(localDb, { merge: margeFlag }).catch((err) => { fb_errmsg(err) })
    }
    const dbRead = (uri: string, afterFunc: any = () => { }) => {
        const _setDb: any = (recodes: any) => { setLocalDb(recodes); afterFunc(); }
        if (dbUriCheck(uri) == false) { _setDb({}); return () => { } }
        return db.doc(uri).onSnapshot((doc) => {
            if (doc.exists) { _setDb(doc.data()); } else { _setDb({}); }
        });
    }

    return [localDb, setLocalDb, dbCreate, dbRead]
}
//const [a, b, c, d] = useDb("")
function dbReducer(state: any, action: any) {
    function dbUriCheck(uri: String) {
        // schema1/ document → True
        // else → False
        const dirs: string[] = uri.split("/")
        if (dirs.length < 2) { return false; }
        for (let i = 0; i < dirs.length; i++) {
            if (dirs[i].length < 1) { return false; }
        }
        return true;
    }
    switch (action.type) {
        case 'add':
            return [...state, {
                text: action.text,
                completed: false
            }];
        // ... other actions ...
        default:
            return state;
    }
}
// UC: studing Reducer

export const AppAuth = () => {
    const [uid,] = useAuth()
    const [tmpAddress, setTmpAddress] = useState("")
    const [tmpPass, setTmpPass] = useState("")

    //functions
    const signUp = (address: string = tmpAddress, pass: string = tmpPass) => {
        auth.createUserWithEmailAndPassword(address, pass).catch((err) => { fb_errmsg(err) })
    }
    const signIn = (address: string = tmpAddress, pass: string = tmpPass) => {
        auth.signInWithEmailAndPassword(address, pass).catch((err) => { fb_errmsg(err) })
    }
    const easyIn = (address: string = "a@b.com", pass: string = "asdfgh") => {
        auth.signInWithEmailAndPassword(address, pass).catch(() => { signUp(address, pass); })
    }
    const easyIn2 = (address: string = "c@d.com", pass: string = "asdfgh") => {
        auth.signInWithEmailAndPassword(address, pass).catch(() => { signUp(address, pass); })
    }
    const resetPass = (address: string = tmpAddress) => {
        auth.sendPasswordResetEmail(address).then(() => { alert("SEND_EMAIL!") }).catch((err) => { fb_errmsg(err) });
    }
    const deleteUser = () => {
        if (window.confirm('Are you really DELETE:USER?\n')) {
            auth.currentUser.delete().then(() => { alert("ACCOUNT_DELETED!") }).catch((err) => { fb_errmsg(err) });
        }
    }
    const googleIn = () => { auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch((err) => { fb_errmsg(err) }) }

    //renders
    const signInModal = () => {
        return (
            <div>
                <button type="button" className="btn btn-success btn-sm m-1" data-toggle="modal" data-target={"#signin_modal"}>
                    <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>SignIn
                </button>
                <div className="modal fade" id="signin_modal" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-signature mr-1"></i>SignIn
                                </h5>
                            </div>
                            <div className="modal-body">
                                <input className="form-control m-1" type="text" style={{ width: "100%" }} name="mail_addr" placeholder="mail_address"
                                    onChange={(evt: any) => { setTmpAddress(evt.target.value); }} />
                                <input className="form-control m-1" type="text" style={{ width: "100%" }} name="mail_pass" placeholder="set_password"
                                    onChange={(evt: any) => { setTmpPass(evt.target.value); }} />
                            </div>
                            <div className="modal-footer d-flex justify-content-start">
                                <div className="flex-grow-1">
                                    <button className="btn btn-secondary m-1" type="button" data-dismiss="modal">
                                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                                    </button>
                                </div>
                                <div>
                                    <button className="btn btn-warning btn-sm m-1" type="button" data-dismiss="modal"
                                        onClick={() => { easyIn() }}>
                                        <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>EzLogin
                                    </button>
                                    <button className="btn btn-warning btn-sm m-1" type="button" data-dismiss="modal"
                                        onClick={() => { easyIn2() }}>
                                        <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>別垢版
                                    </button>
                                    <button className="btn btn-primary btn-sm m-1" type="button" data-dismiss="modal"
                                        onClick={() => { googleIn() }}>
                                        <i className="fab fa-google mr-1" style={{ pointerEvents: "none" }}></i>Google
                                    </button>
                                    <button className="btn btn-success btn-sm m-1" type="button" data-dismiss="modal"
                                        onClick={() => { signIn() }}>
                                        <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>SignIn
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const signUpModal = () => {
        return (
            <div>
                <button type="button" className="btn btn-primary btn-sm m-1" data-toggle="modal" data-target={"#signup_modal"}>
                    <i className="fas fa-file-signature mr-1" style={{ pointerEvents: "none" }}></i>SignUp
                </button>
                <div className="modal fade" id="signup_modal" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-file-signature mr-1"></i>SignUp
                                </h5>
                            </div>
                            <div className="modal-body">
                                <input className="form-control m-1" type="text" style={{ width: "100%" }} name="mail_addr" placeholder="mail_address"
                                    onChange={(evt: any) => { setTmpAddress(evt.target.value); }} />
                                <input className="form-control m-1" type="text" style={{ width: "100%" }} name="mail_pass" placeholder="set_password"
                                    onChange={(evt: any) => { setTmpPass(evt.target.value); }} />
                            </div>
                            <div className="modal-footer d-flex justify-content-start">
                                <div className="flex-grow-1">
                                    <button className="btn btn-secondary m-2" type="button" data-dismiss="modal">
                                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                                    </button>
                                </div>
                                <div>
                                    <button className="btn btn-primary btn-sm m-2" type="button" data-dismiss="modal"
                                        onClick={() => { signUp() }}>
                                        <i className="far fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const config = () => {
        return (
            <div className="p-2">
                <i className="fas fa-cog fa-lg faa-wrench animated-hover" data-toggle="modal" data-target="#config_modal"></i>
                <div className="modal fade" id="config_modal" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"><i className="fas fa-cog mr-1"></i>Config</h5>
                            </div>
                            <div className="modal-body">
                                <h6><i className="fas fa-user mr-1"></i>{auth.currentUser.displayName}</h6>
                                <h6><i className="far fa-envelope mr-1"></i>{auth.currentUser.email}</h6>
                                <div className="form-inline">
                                    <input className="form-control" type="text" name="mail_addr" size={40} placeholder="mail address" />
                                    <button className="btn btn-sm btn-warning m-2" type="button" data-dismiss="modal"
                                        onClick={() => { resetPass(); }}>
                                        <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>RESRT
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-start">
                                <div className="flex-grow-1">
                                    <button className="btn btn-secondary" type="button" data-dismiss="modal">
                                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                                    </button>
                                </div>
                                <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal"
                                    onClick={() => { deleteUser(); }}>
                                    <i className="fas fa-user-slash mr-1" style={{ pointerEvents: "none" }}></i>USER_DELETE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {uid == "" ?
                <div className="d-flex justify-content-between">
                    <div className="ml-auto">
                        <div className="form-inline">
                            {signInModal()}
                            {signUpModal()}
                        </div>
                    </div>
                </div>
                :
                <div className="d-flex justify-content-between">
                    <div className="form-inline">
                        <button className="btn btn-secondary btn-sm mx-1" type="button" onClick={() => { auth.signOut(); }}>
                            <i className="fas fa-sign-out-alt mr-1" style={{ pointerEvents: "none" }}></i>logout
                            </button>
                        {config()}
                    </div>
                </div>
            }
        </div>
    );

}
