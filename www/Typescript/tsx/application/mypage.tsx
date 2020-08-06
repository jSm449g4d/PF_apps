import React, { useState, useEffect } from 'react';
import { useAuth, useDb, needLoginForm } from "../component/firebaseWrapper";
import { stopf5, Query2Dict } from "../component/util_tsx";

export const AppMain = () => {
    const [uid] = useAuth()
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? "" : Query2Dict()["showuid"])
    const [iconUrl, setIconUrl] = useState("")
    const [tmpText, setTmpText] = useState("")
    const [tmpSwitch, setTmpSwitch] = useState("")

    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + showUid }); }, [showUid])
    // readIcon
    useEffect(() => { dispatchMypage({ type: "download", fileName: "icon.img", func: (_url: any) => setIconUrl(_url) }) }, [dbMypage])

    if (showUid != uid && showUid == "") setShowUid(uid);

    const createMypage = () => {
        if (uid != showUid) return false
        dispatchMypage({
            type: "create", recodes: {
                nickname: "ニックネームを入力してください", profile: "プロファイルを入力してください"
            }, merge: true
        })
    }
    const updateIcon = () => {
        dispatchMypage({ type: "download", fileName: "icon.img", func: (_url: any) => setIconUrl(_url) })
    }
    const showIcon = () => {
        if (showUid != uid) return (
            <div>
                {iconUrl == "" ?
                    <i className="fab fa-themeisle fa-2x m-2"><br />No Icon</i>
                    :
                    <img className="img-fluid" src={iconUrl} alt={iconUrl} />
                }
            </div>);
        return (
            <div className="d-flex flex-column text-center">
                <div>
                    {iconUrl == "" ?
                        <i className="fab fa-themeisle fa-2x m-2"><br />No Icon</i>
                        :
                        <img className="img-fluid" src={iconUrl} alt={iconUrl} />
                    }
                </div>
                <button type="button" className="btn btn-outline-success btn-lg m-1"
                    onClick={(evt) => { $(document.getElementById("mypage_uploadIcon")).click() }}>
                    <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>Icon
                </button>
                <input type="file" className="d-none" accept="image/jpeg,image/png" id="mypage_uploadIcon"
                    onChange={(evt) => {
                        dispatchMypage({ type: "upload", file: evt.target.files[0], fileName: "icon.img" })
                        setTimeout(() => { updateIcon() }, 2000)
                    }} />
            </div>
        )
    }
    const dispNickname = () => {
        if (showUid != uid) return (<div><i className="far fa-user mr-1"></i>{dbMypage["nickname"]}</div>);
        if (tmpSwitch == "nickname") return (
            <div className="text-center">
                <input className="form-control form-control-lg m-1" type="text" placeholder="nickname" value={tmpText} size={32}
                    onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                <button className="btn btn-success btn-lg m-1" type="button"
                    onClick={() => {
                        dispatchMypage({ type: "create", recodes: { "nickname": tmpText }, merge: true })
                        setTmpText(""); setTmpSwitch("");
                    }}>
                    <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                </button>
                <button className="btn btn-secondary btn-lg m-1" type="button"
                    onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                    <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                </button>
            </div>
        )
        return (
            <div>
                <i className="far fa-user mr-1"></i>{dbMypage["nickname"]}
                <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                    onClick={() => { setTmpText(dbMypage["nickname"]); setTmpSwitch("nickname"); }}></i>
            </div>
        )

    }
    const dispProfile = () => {
        if (showUid != uid) return (<div><h3>Profile</h3>{dbMypage["profile"]}</div>);
        if (tmpSwitch == "profile") return (
            <div>
                <h3 className="form-inline">Profile
                    <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                        onClick={() => { setTmpText(dbMypage["profile"]); setTmpSwitch("profile"); }}></i>
                    <button className="btn btn-success btn-lg m-1" type="button"
                        onClick={() => {
                            dispatchMypage({ type: "create", recodes: { "profile": tmpText }, merge: true })
                            setTmpText(""); setTmpSwitch("");
                        }}>
                        <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                    </button>
                    <button className="btn btn-secondary btn-lg m-1" type="button"
                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                        <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                    </button>
                </h3>
                <textarea className="form-control" rows={4} value={tmpText}
                    onChange={(evt: any) => { setTmpText(evt.target.value) }}></textarea>
            </div>
        )
        return (
            <div>
                <h3>Profile
                    <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                        onClick={() => { setTmpText(dbMypage["profile"]); setTmpSwitch("profile"); }}></i>
                </h3>
                <div>{dbMypage["profile"]}</div>
            </div>
        )

    }
    const appBody = () => {
        if (uid == "") return (<div>{needLoginForm()}</div>)
        if (dbMypage["nickname"]==null) createMypage()
        return (
            <div className="p-2" style={{ backgroundColor: "khaki", border: "3px double silver" }}>
                <div className="row">
                    <h2 className="col-12 text-center">{dispNickname()}</h2>
                    <div className="col-sm-12 col-lg-4">{showIcon()}</div>
                    <div className="col-sm-12 col-lg-8">
                        <div className="p-1 text-center" style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
                            {dispProfile()}
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