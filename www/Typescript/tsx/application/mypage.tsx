import React, { useState, useEffect } from 'react';
import { useAuth, useDb, needLoginButton } from "../component/firebaseWrapper";
import { stopf5, Query2Dict } from "../component/util_tsx";

export const AppMain = () => {
    const [uid] = useAuth()
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? "" : Query2Dict()["showuid"])
    const [iconUrl, setIconUrl] = useState("")

    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + showUid }); }, [showUid])
    // readIcon
    useEffect(() => { dispatchMypage({ type: "download", fileName: "icon.img", func: (_url: any) => setIconUrl(_url) }) }, [dbMypage])

    if (showUid != uid && showUid == "") setShowUid(uid);
    
    const createMypage = () => {
        if (uid == showUid)
            return (
                <button type="button" className="btn btn-outline-success btn-bg m-2"
                    onClick={() => {
                        if (stopf5.check("cleateMypage", 500, true) == false) return; // To prevent high freq access
                        dispatchMypage({
                            type: "create", recodes: {
                                 nickname: "窓の民は名無し", pr: "私はJhon_Doe。窓の蛇遣いです。" 
                            }, merge: true
                        })
                    }}>
                    <i className="fas fa-file-signature mr-1" style={{ pointerEvents: "none" }}></i>Create Mypage
                </button>
            )
        return (
            <div>
                <h5>
                    <i className="fas fa-wind mr-1"></i>This account's page is not Exist
                </h5>
                <button type="button" className="btn btn-outline-success btn-bg m-2"
                    onClick={() => {
                        setShowUid(uid)
                    }}>
                    <i className="fas fa-home mr-1" style={{ pointerEvents: "none" }}></i>Mypage
                </button>
            </div>
        )
    }
    const showIcon = () => {
        if (iconUrl == "") { return (<i className="fab fa-themeisle fa-2x m-2"><br />No Icon</i>) }
        return (
            <div className="m-2">
                <img src={iconUrl} alt={iconUrl} width="156" height="156" />
            </div>
        )
    }
    const uploadIcon = () => {
        if (showUid != uid) return;
        return (
            <button type="button" className="btn btn-outline-success btn-sm m-1"
                onClick={(evt) => { $(evt.currentTarget.children[0]).click() }}>
                <input type="file" className="d-none" accept="image/jpeg,image/png"
                    onChange={(evt) => {
                        setIconUrl("")
                        dispatchMypage({ type: "upload", file: evt.target.files[0], fileName: "icon.img" })
                        dispatchMypage({ type: "download", fileName: "icon.img", func: (_url: any) => setIconUrl(_url) })
                    }} />
                <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>Icon
            </button>
        )
    }
    const changeProfile = (title: string, state_element: string) => {
        if (showUid != uid) return (<div />);
        const modal_id = "mygape_modal_" + title;
        return (
            <div>
                <button type="button" className="btn btn-outline-success btn-sm m-1" data-toggle="modal" data-target={"#" + modal_id}>
                    <i className="far fa-keyboard mr-1" style={{ pointerEvents: "none" }}></i>{title}
                </button>
                <div className="modal fade" id={modal_id} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                            </div>
                            <div className="modal-body">
                                <textarea className="form-control" value={
                                    dbMypage ? dbMypage[state_element] : ""}
                                    rows={4} style={{ width: "100%" }}
                                    onChange={(evt) => {
                                        let _mypage: any = dbMypage ? dbMypage : {}
                                        _mypage[state_element] = evt.target.value
                                        dispatchMypage({ type: "commit", recodes: _mypage, merge: true })
                                    }}>
                                </textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-success" data-dismiss="modal"
                                    onClick={() => {
                                        if (stopf5.check("1", 500, true) == false) return; // To prevent high freq access
                                        dispatchMypage({ type: "create" })
                                    }}>
                                    <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>Submit
                                </button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    const appBody = () => {
        if (uid == "") return needLoginButton()
        if (dbMypage.length < 1) { return (<div>{createMypage()}</div>) }
        return (
            <div className="m-2" style={{ background: "khaki" }}>
                <div className="d-flex justify-content-start">
                    {showIcon()}
                    <div className="m-1 p-1 flex-grow-1" style={{ backgroundColor: "rgba(100,100,100,0.1)" }}>
                        <div className="d-flex justify-content-start">
                            <h3 className="flex-grow-1">
                                <i className="far fa-user mr-1"></i>
                                {dbMypage["nickname"] ? dbMypage["nickname"] : ""}
                            </h3>
                            <div className="form-inline">
                                {changeProfile("Nickname", "nickname")}{uploadIcon()}
                            </div>
                        </div>
                        <div className="m-1 p-1" style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
                            <div className="d-flex justify-content-between">
                                <h5>PR</h5>
                                {changeProfile("PR", "pr")}
                            </div>
                            {dbMypage["pr"] ? dbMypage["pr"] : ""}
                        </div>
                    </div>
                </div>
                {showUid == uid ?
                    <div />
                    :
                    <button type="button" className="btn btn-success btn-sm m-2"
                        onClick={() => {
                            setShowUid(uid)
                        }}>
                        <i className="fas fa-home mr-1" style={{ pointerEvents: "none" }}></i>Mypage
                    </button>
                }
            </div>
        )
    }
    return (
        <div className="p-2 bg-light">
            {appBody()}
        </div>
    );
}

//titleLogo
export const titleLogo = () => {
    return (<h3 style={{ fontFamily: "Century", color: "black" }}>マイページ</h3>)
}