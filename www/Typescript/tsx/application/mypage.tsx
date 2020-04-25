import React, { useState, useEffect } from 'react';
import { fb, useAuth, useDb } from "../component/account";
import { stopf5, Query2Dict } from "../component/util_tsx";

export const App_tsx = () => {
    const [uid,] = useAuth()
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? "" : Query2Dict()["showuid"])
    const [iconUrl, setIconUrl] = useState("")

    const [dbMypage, dispatchMypage] = useDb()
    useEffect(() => {
        dispatchMypage({ type: "setUri", uri: "mypage/" + showUid });
        // HACK: UseDb will integrate useEffect in the future
        setIconUrl(dispatchMypage({ type: "download", uri: "mypage/" + showUid + "/icon.img" }))
    }, [showUid])

    const createMypage = () => {
        if (uid == "") return (<h5><i className="fas fa-wind mr-1"></i>Plz login</h5>)
        if (uid == showUid)
            return (
                <button type="button" className="btn btn-outline-success btn-bg m-2"
                    onClick={() => {
                        if (stopf5.check("cleateMypage", 500, true) == false) return; // To prevent high freq access
                        dispatchMypage({
                            type: "create", recodes: {
                                [Date.now().toString() + "_" + showUid]: { nickname: "窓の民は名無し", pr: "私はJhon_Doe。窓の蛇遣いです。" }
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
                    onClick={() => { setShowUid(uid) }}>
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
                        if (stopf5.check("upIcon", 500, true) == false) return; // To prevent high freq access
                        dispatchMypage({ type: "upload", file: evt.target.files[0], fileName: "icon.img" })
                        setTimeout(() => {
                            setIconUrl(dispatchMypage({ type: "download", uri: "mypage/" + showUid + "/icon.img" }))
                        }, 1000)
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
                                    Object.values(dbMypage)[0] ? Object.values<any>(dbMypage)[0][state_element] : ""}
                                    rows={4} style={{ width: "100%" }}
                                    onChange={(evt) => {
                                        let _mypage: any = Object.values(dbMypage)[0] ? Object.values(dbMypage)[0] : {}
                                        _mypage[state_element] = evt.target.value
                                        dispatchMypage({ type: "commit", recodes: { [Date.now() + "_" + uid]: _mypage }, merge: true })
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

    return (
        <div className="p-2 bg-light">
            {Object.keys(dbMypage).length < 1 ?
                <div>{createMypage()}</div>
                :
                <div className="m-2" style={{ background: "khaki" }}>
                    <div className="d-flex justify-content-start">
                        {showIcon()}
                        <div className="m-1 p-1 flex-grow-1" style={{ backgroundColor: "rgba(100,100,100,0.1)" }}>
                            <div className="d-flex justify-content-start">
                                <h3 className="flex-grow-1">
                                    <i className="far fa-user mr-1"></i>
                                    {Object.values(dbMypage)[0] ? Object.values<any>(dbMypage)[0]["nickname"] : ""}
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
                                {Object.values(dbMypage)[0] ? Object.values<any>(dbMypage)[0]["pr"] : ""}
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
