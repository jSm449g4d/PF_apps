import React, { useState, useEffect, useReducer } from 'react';
import { auth, fb, fb_errmsg } from "../component/account";
import { stopf5, Query2Dict } from "../component/util_tsx";

const storage = fb.storage();
const db = fb.firestore()


export const App_tsx = () => {
    const [uid, setUid] = useState("")
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? "" : Query2Dict()["showuid"])
    const [iconUrl, setIconUrl] = useState("")
    const [profile, setProfile] = useState<{ [keys: string]: string }>({})
    const [now, setNow] = React.useState(new Date());
    const [_, forceRender] = useReducer(x => x + 1, 0); //FIXME: Hooks have trouble in dict rendering
    // FirebaseSnapping
    useEffect(() => {
        const _snaps = [dbR_GetProfile()]
        return () => { for (let i = 0; i < _snaps.length; i++) { _snaps[i](); } }
    }, [uid, showUid])
    // setInterval
    useEffect(() => {
        const intervalId = setInterval(() => {
            _tick();
            setNow(new Date());
        }, 100);
        return () => { clearInterval(intervalId) };
    }, [now]);

    function dbC_SetProfile() {
        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
        db.doc("mypage/" + showUid).set({
            [Date.now().toString() + "_" + showUid]: profile
        }).catch((err) => { fb_errmsg(err) })
    }
    function dbR_GetProfile() {
        if (showUid == "") { setProfile({}); return () => { } };
        return db.doc("mypage/" + showUid).onSnapshot((doc) => {
            if (doc.exists) {
                const tmpRecodes: any = doc.data()
                const tsuids = Object.keys(tmpRecodes).sort()[0]
                setProfile(() => (tmpRecodes[tsuids])); forceRender();
                stR_GetIcon();
            }
            else { setProfile({}) }
        });
    }
    function dbC_MakeProfile() {
        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
        db.doc("mypage/" + showUid).set({
            [Date.now().toString() + "_" + showUid]:
                { nickname: "窓の民は名無し", pr: "私はJhon_Doe。窓の蛇遣いです。" }
        }).catch((err) => { fb_errmsg(err) })
    }
    function stC_SetIcon(upload_file: any) {
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq access
        storage.ref("mypage/" + showUid + "/icon.img").put(upload_file);
        setTimeout(() => { stR_GetIcon() }, 1000)
    }
    function stR_GetIcon() {
        storage.ref("mypage/" + showUid + "/icon.img").getDownloadURL().then((url) => {
            if (iconUrl != url) setIconUrl(url);
        }).catch(() => { if (iconUrl != "") setIconUrl(""); })
    }
    function _tick() {
        // Auth
        if (auth.currentUser) {
            if (uid != auth.currentUser.uid) {
                setUid(auth.currentUser.uid);
            }
        } else {
            if (uid != "") setUid("");
        }
        if (showUid == "" && uid != "") { setShowUid(uid); }
    }

    function render_createmypage() {
        if (uid == "") return (<h5><i className="fas fa-wind mr-1"></i>Plz login</h5>)
        if (uid == showUid)
            return (
                <button type="button" className="btn btn-outline-success btn-bg m-2"
                    onClick={() => { dbC_MakeProfile() }}>
                    <i className="fas fa-file-signature mr-1" style={{ pointerEvents: "none" }}></i>Create Mypage
                </button>
            )
        return (
            <div>
                <h5>
                    <i className="fas fa-wind mr-1"></i>This account's page is not Exist
                </h5>
                <button type="button" className="btn btn-outline-success btn-bg m-2"
                    onClick={() => { setShowUid(uid) }}>
                    <i className="fas fa-home mr-1" style={{ pointerEvents: "none" }}></i>Mypage
                </button>
            </div>
        )
    }
    function render_dlicon() {
        if (iconUrl == "") { return (<i className="fab fa-themeisle fa-2x m-2"><br />No Icon</i>) }
        return (
            <div className="m-2">
                <img src={iconUrl} alt={iconUrl} width="156" height="156" />
            </div>
        )
    }
    function render_upicon() {
        if (showUid != uid) return;
        return (
            <button type="button" className="btn btn-outline-success btn-sm m-1"
                onClick={(evt) => { $(evt.currentTarget.children[0]).click() }}>
                <input type="file" className="d-none" accept="image/jpeg,image/png"
                    onChange={(evt) => { stC_SetIcon(evt.target.files[0]) }} />
                <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>Icon
            </button>
        )
    }
    function render_changebutton(title: string, state_element: string) {
        if (showUid != uid) return (<div />);
        let modal_id = "mygape_modal_" + title; let modal_id_s = "#" + modal_id;
        return (
            <div>
                <button type="button" className="btn btn-outline-success btn-sm m-1" data-toggle="modal" data-target={modal_id_s}>
                    <i className="far fa-keyboard mr-1" style={{ pointerEvents: "none" }}></i>{title}
                </button>
                <div className="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                            </div>
                            <div className="modal-body">
                                <textarea className="form-control" value={profile[state_element]} rows={4} style={{ width: "100%" }}
                                    onChange={(evt) => {
                                        let tmpProfile = Object.assign(profile)
                                        tmpProfile[state_element] = evt.target.value
                                        setProfile(tmpProfile); forceRender();
                                    }}></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-success" data-dismiss="modal"
                                    onClick={() => { dbC_SetProfile() }}>
                                    <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>Submit
                                </button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 bg-light">
            {"nickname" in profile == false ?
                <div>{render_createmypage()}</div>
                :
                <div className="m-2" style={{ background: "khaki" }}>
                    <div className="d-flex justify-content-start">
                        {render_dlicon()}
                        <div className="m-1 p-1 flex-grow-1" style={{ backgroundColor: "rgba(100,100,100,0.1)" }}>
                            <div className="d-flex justify-content-start">
                                <h3 className="flex-grow-1">
                                    <i className="far fa-user mr-1"></i>{profile["nickname"]}
                                </h3>
                                <div className="form-inline">
                                    {render_changebutton("Nickname", "nickname")}{render_upicon()}
                                </div>
                            </div>
                            <div className="m-1 p-1" style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
                                <div className="d-flex justify-content-between">
                                    <h5>PR</h5>
                                    {render_changebutton("PR", "pr")}
                                </div>
                                {profile["pr"]}
                            </div>
                        </div>
                    </div>
                    {showUid == uid ?
                        <div />
                        :
                        <button type="button" className="btn btn-success btn-sm m-2"
                            onClick={() => { setShowUid(uid) }}>
                            <i className="fas fa-home mr-1" style={{ pointerEvents: "none" }}></i>Mypage
                        </button>
                    }
                </div>
            }
        </div>
    );
}
