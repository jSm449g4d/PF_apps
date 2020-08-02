import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import firebase from 'firebase/app';
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { string } from 'prop-types';


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

const fb = firebase;
const auth = firebase.auth();
const db = fb.firestore()
const storage = fb.storage();

fb.analytics();

export const fbErr = (error: any) => { console.log("error_code:" + error.code + "\nerror_message:" + error.message); }
export const dbFieldDelete = fb.firestore.FieldValue.delete()

export const useAuth = () => {
    const [uid, setUid] = useState("")
    useEffect(() => {
        const _snap = firebase.auth().onAuthStateChanged(user => {
            if (user) { setUid(auth.currentUser.uid); }
            else { setUid(""); }
        })
        return () => _snap();
    }, []);
    return [uid]
}

export const useDb = (initialState: any = { uri: "", recodes: {} }) => {
    const uriCheck = (uri: String) => {
        // schema1/ document → True
        // else → False
        const dirs: string[] = uri.split("/")
        if (dirs.length < 2) { return false; }
        for (let i = 0; i < dirs.length; i++) {
            if (dirs[i].length < 1) { return false; }
        }
        return true;
    }
    const [recodes, setRecodes] = useState(initialState["recodes"]);
    const [uri, setUri] = useState(initialState["uri"]);
    // snap Db:(Read)
    useEffect(() => {
        const _snap = uriCheck(uri) ?
            db.doc(uri).onSnapshot((doc) => {
                if (doc.exists) { setRecodes(doc.data()); }
                else { setRecodes(initialState["recodes"]); }
            })
            : () => { }
        return () => _snap();
    }, [uri]);
    // Db:(Create, Delete) Storage:(Upload Download Delete)
    const dispatch = (action: any) => {
        // reducer 
        switch (action.type) {
            case 'create': //{type:xxx, recodes:yyy, merge:zzz}
                if (uriCheck(uri) == false) break;
                if (!action.recodes) { // If you want to push local commit
                    db.doc(uri).set(recodes, { merge: action["merge"] ? action["merge"] : false })
                        .catch(err => fbErr(err)); break;
                }
                db.doc(uri).set( // Push directly
                    action.recodes ? action.recodes : action.recodes,
                    { merge: action.merge ? action.merge : false })
                    .catch(err => fbErr(err))
                break;
            case 'delete': //{type:xxx}
                if (uriCheck(uri) == false) break;
                db.doc(uri).delete().catch(err => fbErr(err))
                break;
            case 'commit': //{type:xxx, recodes:yyy}
                if (uriCheck(uri) == false) break;
                setRecodes(action.recodes ? action.recodes : initialState.recodes)
                break;
            case 'upload': //{type:xxx file:yyy fileName:zzz} → fileName
                if (uriCheck(uri) == false) return String("");
                if (!action.file) return String("");
                action.fileName = action.fileName ? action.fileName : action.file.name
                storage.ref(uri + "/" + action.fileName).put(action.file).catch(err => fbErr(err))
                return String(action.fileName);
            case 'download': //{type:xxx fileName:yyy func:zzz}
                if (uriCheck(uri) == false) break;
                storage.ref(uri + "/" + action.fileName).getDownloadURL()
                    .then(url => action.func(url)).catch(err => fbErr(err));
                break;
            // HACK: DB and Storage must be common in 隙間
            case 'strageDelete': //{type:xxx fileName:yyy}
                if (uriCheck(uri) == false) break;
                storage.ref(uri + "/" + action.fileName).delete().catch(err => fbErr(err))
                break;
            case 'setUri': //{type:xxx, uri:yyy}
                setUri(action.uri);
                break;
            default: alert("XXX: Plz check action.type"); break;
        }
    }
    return [recodes, dispatch];
}

//loginFunction
const signUp = (address: string, pass: string) => {
    auth.createUserWithEmailAndPassword(address, pass).catch(err => fbErr(err))
}
const signIn = (address: string, pass: string) => {
    auth.signInWithEmailAndPassword(address, pass).catch(err => fbErr(err))
}
const easyIn = (address: string = "test@mail.com", pass: string = "asdfgh") => {
    auth.signInWithEmailAndPassword(address, pass).catch(() => { signUp(address, pass); })
}
const easyIn2 = (address: string = "test2@mail.com", pass: string = "asdfgh") => {
    auth.signInWithEmailAndPassword(address, pass).catch(() => { signUp(address, pass); })
}
const resetPass = (address: string) => {
    auth.sendPasswordResetEmail(address).then(() => { alert("SEND_EMAIL!") }).catch(err => fbErr(err));
}
const deleteUser = () => {
    if (window.confirm('Are you really DELETE:USER?\n')) {
        auth.currentUser.delete().then(() => { alert("ACCOUNT_DELETED!") }).catch(err => fbErr(err));
    }
}
const googleIn = () => { auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(err => fbErr(err)) }
export const AppAuth = () => {
    const [uid,] = useAuth()
    const [tmpAddress, setTmpAddress] = useState("")
    const [tmpPass, setTmpPass] = useState("")

    //renders
    const LoginModal = () => {
        return (
            <div>
                {/*Button*/}
                <button type="button" className="btn btn-link m-2" data-toggle="modal" data-target={"#signin_modal"}>
                    <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>
                    <b>ログイン</b>
                </button>
                {/*signUp*/}
                <div className="modal fade" id="signup_modal" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-file-signature mr-1"></i>アカウントの新規作成
                                </h5>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body d-flex flex-column text-center">
                                <input className="form-control form-control-lg m-1" type="text" name="mail_addr" placeholder="mail_address"
                                    onChange={(evt: any) => { setTmpAddress(evt.target.value); }} />
                                <input className="form-control form-control-lg m-1" type="text" name="mail_pass" placeholder="password"
                                    onChange={(evt: any) => { setTmpPass(evt.target.value); }} />
                                <button className="btn btn-primary btn-lg m-1" type="button" data-dismiss="modal"
                                    onClick={() => { signUp(tmpAddress, tmpPass) }}>
                                    <i className="far fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>
                                    <b>新規作成する</b>
                                </button>
                            </div>
                            <div className="modal-footer">
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*signIn*/}
                <div className="modal fade" id="signin_modal" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-signature mr-1"></i>ログイン
                                </h5>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body d-flex flex-column text-center">
                                <div className="d-flex flex-column text-center">
                                    <input className="form-control form-control-lg m-1" type="text" name="mail_addr" placeholder="mailAddress"
                                        onChange={(evt: any) => { setTmpAddress(evt.target.value); }} />
                                    <input className="form-control form-control-lg m-1" type="text" name="mail_pass" placeholder="password"
                                        onChange={(evt: any) => { setTmpPass(evt.target.value); }} />
                                    <button className="btn btn-primary btn-lg m-1" type="button" data-dismiss="modal"
                                        onClick={() => { signIn(tmpAddress, tmpPass) }}>
                                        <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>
                                        <b>ログイン</b>
                                    </button>
                                    <p />
                                    <button className="btn btn-light btn-lg m-1" type="button" data-dismiss="modal"
                                        onClick={() => { googleIn() }}>
                                        <i className="fab fa-google mr-1" style={{ pointerEvents: "none" }}></i>
                                        Googleアカウントででログインする
                                    </button>
                                    <button type="button" className="btn btn-link btn-lg mx-1" data-dismiss="modal" data-target={"#signin_modal"}
                                        onClick={(evt) => { $(evt.currentTarget.children[0]).click(); }}>
                                        <button type="button" className="d-none" data-toggle="modal" data-target={"#signup_modal"} />
                                        <i className="fas fa-file-signature mr-1" style={{ pointerEvents: "none" }}></i>
                                        <b>アカウントを新規作成する</b>
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-end">
                                <h5 className="modal-title">
                                    ※おためしログイン:
                                </h5>
                                <div>
                                    <button className="btn btn-warning m-1" type="button" data-dismiss="modal"
                                        onClick={() => { easyIn() }}>
                                        <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>EzLogin
                                    </button>
                                    <button className="btn btn-warning m-1" type="button" data-dismiss="modal"
                                        onClick={() => { easyIn2() }}>
                                        <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>別垢版
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
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"><i className="fas fa-cog mr-1"></i>Config</h5>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6><i className="fas fa-user mr-1"></i>{auth.currentUser.displayName}</h6>
                                <h6><i className="far fa-envelope mr-1"></i>{auth.currentUser.email}</h6>
                                <p />
                                <div className="d-flex flex-column text-center">
                                    <h5>メールアドレスを変更する</h5>
                                    <input className="form-control form-control-lg" type="text" name="mail_addr" placeholder="mail address" />
                                    <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal"
                                        onClick={() => { resetPass(tmpAddress); }}>
                                        <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>
                                        確認メールを送信
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-end">
                                <button type="button" className="btn btn-danger" data-dismiss="modal"
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
                            <button className="btn btn-warning m-1" type="button" onClick={() => { easyIn() }}>
                                <b>
                                    <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>おためしログイン
                                </b>
                            </button>
                            {LoginModal()}
                        </div>
                    </div>
                </div>
                :
                <div className="d-flex justify-content-between">
                    <div className="form-inline">
                        <h6 className="d-flex flex-column">
                            <div>ようこそ</div>
                            {auth.currentUser.displayName == "" ?
                                <div><i className="fas fa-user mr-1"></i>{auth.currentUser.displayName}</div>
                                :
                                <div><i className="far fa-envelope mr-1"></i>{auth.currentUser.email}</div>}
                        </h6>
                        <button className="btn btn-secondary btn-sm mx-1" type="button" onClick={() => { auth.signOut(); }}>
                            <i className="fas fa-sign-out-alt mr-1" style={{ pointerEvents: "none" }}></i>
                            <b>ログアウト</b>
                        </button>
                        {config()}
                    </div>
                </div>
            }
        </div>
    );
}
export const needLoginForm = () => {
    //renders
    return (
        <div className="p-2" style={{ backgroundColor: "wheat", border: "3px double silver" }}>
            <div className="d-flex flex-column text-center">
                <h4>ログインが必要です</h4>
                <p />
                <button type="button" className="btn btn-primary m-2" data-toggle="modal" data-target={"#signin_modal"}>
                    <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>
                    <b><i className="fas fa-sign-in-alt mr-1"></i>ログインする</b>
                </button>
                <p />
                <button className="btn btn-light btn m-1" type="button" data-dismiss="modal"
                    onClick={() => { googleIn() }}>
                    <i className="fab fa-google mr-1" style={{ pointerEvents: "none" }}></i>
                                        Googleアカウントででログインする
                        </button>
                <p />
                <button type="button" className="btn btn-link btn mx-1" data-dismiss="modal" data-target={"#signin_modal"}
                    onClick={(evt) => { $(evt.currentTarget.children[0]).click(); }}>
                    <button type="button" className="d-none" data-toggle="modal" data-target={"#signup_modal"} />
                    <i className="fas fa-file-signature mr-1" style={{ pointerEvents: "none" }}></i>
                    <b>アカウントを新規作成する</b>
                </button>
                <p />
                <button className="btn btn-warning btn m-1" type="button" data-dismiss="modal"
                    onClick={() => { easyIn() }}>
                    <i className="fas fa-sign-in-alt mr-1" style={{ pointerEvents: "none" }}></i>
                    <b>おためしログイン</b>
                </button>
            </div>
        </div>
    )
}
