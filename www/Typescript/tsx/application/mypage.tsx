import React, { useState, useEffect } from 'react';
import { useAuth, useDb, needLoginForm } from "../component/firebaseWrapper";
import { stopf5, Query2Dict } from "../component/util_tsx";

export const AppMain = () => {
    const [uid] = useAuth()
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? "" : Query2Dict()["showuid"])
    const [tmpText, setTmpText] = useState("")
    const [tmpSwitch, setTmpSwitch] = useState("")

    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + showUid }); }, [showUid])

    if (showUid != uid && showUid == "") setShowUid(uid);

    const createMypage = () => {
        if (uid != showUid) return false
        return (
            <div className="d-flex flex-column text-center">
                <button type="button" className="btn btn-success btn-lg m-1"
                    onClick={(evt) => {
                        dispatchMypage({
                            type: "create", recodes: {
                                nickname: "ニックネームを入力してください", profile: "プロファイルを入力してください", iconUrl: ""
                            }, merge: true
                        })
                    }}>
                    マイページを作成する
                </button>
            </div>)
    }
    const updateIcon = () => {
        dispatchMypage({
            type: "download", fileName: "icon.img",
            func: (_url: any) => {
                if (_url != dispatchMypage["iconUrl"]) dispatchMypage({ type: "create", recodes: { "iconUrl": _url }, merge: true })
            }
        })
    }
    const showIcon = () => {
        const uploadIconButton = () => {
            return (
                <div className="d-flex text-center">
                    <button className="flex-fill btn btn-success btn-lg btn-push m-1" type="button"
                        onClick={(evt) => { $(document.getElementById("mypage_uploadIcon")).click() }}>
                        <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>画像をアップロード
                    </button>
                    <input type="file" className="d-none" accept="image/jpeg,image/png" id="mypage_uploadIcon"
                        onChange={(evt) => {
                            dispatchMypage({ type: "upload", file: evt.target.files[0], fileName: "icon.img" })
                            dispatchMypage({ type: "create", recodes: { "iconUrl": evt.target.files[0].name }, merge: true })
                            setTimeout(() => updateIcon(), 2000)
                        }} />
                </div>
            )
        }
        return (
            <div>
                {dbMypage["iconUrl"] == "" ?
                    <h4 className="d-flex flex-column text-center img-thumbnail" style={{ backgroundColor: "snow", height: "150px", objectFit: "contain" }} >
                        <i className="fab fa-themeisle fa-2x m-2"></i>No Image
                    </h4>
                    :
                    <img className="img-fluid img-thumbnail" src={dbMypage["iconUrl"]} alt={dbMypage["iconUrl"]} />
                }
                {showUid == uid ?
                    <div>{uploadIconButton()}</div>
                    :
                    <div></div>
                }
            </div>);
    }
    const dispNickname = () => {
        if (showUid != uid) return (<div><i className="far fa-user mr-1"></i>{dbMypage["nickname"]}</div>);
        if (tmpSwitch == "nickname") return (
            <div className="text-center">
                <input className="form-control form-control-lg m-1" type="text" placeholder="nickname" value={tmpText} size={32}
                    onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                <div className="d-flex">
                    <button className="flex-fill btn btn-success btn-lg m-1" type="button"
                        onClick={() => {
                            dispatchMypage({ type: "create", recodes: { "nickname": tmpText }, merge: true })
                            setTmpText(""); setTmpSwitch("");
                        }}>
                        <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                    </button>
                    <button className="flex-fill btn btn-secondary btn-lg m-1" type="button"
                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                        <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                </button>
                </div>
            </div>
        )
        return (
            <div>
                <i className="far fa-user mr-1"></i>{dbMypage["nickname"]}
                <i className="fas fa-pencil-alt ml-2 fa-btn"
                    onClick={() => { setTmpText(dbMypage["nickname"]); setTmpSwitch("nickname"); }}></i>
            </div>
        )

    }
    const dispProfile = () => {
        if (showUid != uid) return (<div><h3>Profile</h3>{dbMypage["profile"]}</div>);
        if (tmpSwitch == "profile") return (
            <div>
                <h3>Profile
                    <div className="d-flex">
                        <button className="flex-fill btn btn-success btn-lg m-1" type="button"
                            onClick={() => {
                                dispatchMypage({ type: "create", recodes: { "profile": tmpText }, merge: true })
                                setTmpText(""); setTmpSwitch("");
                            }}>
                            <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                        </button>
                        <button className="flex-fill btn btn-secondary btn-lg m-1" type="button"
                            onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                            <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                        </button>
                    </div>
                </h3>
                <textarea className="form-control" rows={4} value={tmpText}
                    onChange={(evt: any) => { setTmpText(evt.target.value) }}></textarea>
            </div>
        )
        return (
            <div>
                <h3>Profile
                    <i className="fas fa-pencil-alt ml-2 fa-btn"
                        onClick={() => { setTmpText(dbMypage["profile"]); setTmpSwitch("profile"); }}></i>
                </h3>
                <div>{dbMypage["profile"]}</div>
            </div>
        )

    }
    const dispShop = () => {
        if (("shopName" in dbMypage) == false) return (<div></div>)
        return (
            <div className="m-1 text-center" style={{ backgroundColor: "#ffdfef" }}>
                <h5>出店情報</h5>
                <div>店名: {dbMypage["shopName"]}</div>
            </div>
        )

    }
    const appBody = () => {
        if (uid == "") return (<div>{needLoginForm()}</div>)
        if (dbMypage["nickname"] == null) return (<div>{createMypage()}</div>)
        return (
            <div className="p-1" style={{ backgroundColor: "lavender", border: "3px double silver" }}>
                <div className="row">
                    <h2 className="col-12 text-center">{dispNickname()}</h2>
                    <div className="col-sm-12 col-lg-3">{showIcon()}</div>
                    <div className="col-sm-12 col-lg-9">
                        <div className="p-1 text-center" style={{ backgroundColor: "rgba(255,255,255,0.5)", border: "solid silver" }}>
                            {dispProfile()}{dispShop()}
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
    return (<div style={{ fontFamily: "Impact", color: "black" }}>マイページ</div>)
}