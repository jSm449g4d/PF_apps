import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb, needLoginForm } from "../component/firebaseWrapper";
import { stopf5, jpclock, Unixtime2String } from "../component/util_tsx";

export const AppMain = () => {
    const [uid] = useAuth()
    const [room, setRoom] = useState("main")
    const [tmpContent, setTmpContent] = useState("")
    const [tmpFile, setTmpFile] = useState(null)
    const [tmpText, setTmpText] = useState("")
    const [tmpSwitch, setTmpSwitch] = useState("")

    const [dbTptef, dispatchTptef] = useDb()
    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    useEffect(() => { dispatchTptef({ type: "setUri", uri: "tptef/" + room }); }, [room])
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + uid }) }, [uid])

    // jpclock (decoration)
    const [jpclockNow, setJpclockNow] = useState("")
    useEffect(() => {
        const _intervalId = setInterval(() => setJpclockNow(jpclock()), 500);
        return () => clearInterval(_intervalId);
    }, []);

    // functions
    const remark = () => {
        if (stopf5.check("dbC_AddRemark", 500, true) == false) return; // To prevent high freq access
        dispatchTptef({
            type: "create", recodes: {
                [Date.now().toString() + "_" + uid]: {
                    handlename: (dbMypage) ? dbMypage["nickname"] : "None",
                    content: tmpContent,
                    attachment: dispatchTptef({ type: "upload", file: tmpFile }),
                }
            }, merge: true
        })
    }
    const deleteRemark = (tsuid: string) => {
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq 
        dispatchTptef({ type: "strageDelete", fileName: dbTptef[tsuid].attachment })
        dispatchTptef({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true })
    }

    // renders
    const threadTable = () => {
        const tmpRecord = [];
        const tsuids = Object.keys(dbTptef).sort();
        for (var i = 0; i < tsuids.length; i++) {
            const tmpData = [];
            tmpData.push(
                <div className="col-12 p-1 border"
                    style={{ background: "linear-gradient(rgba(60,60,60,0), rgba(60,60,60,0.15))" }}>
                    <h5 className="text-center">
                        <i className="far fa-user mr-1"></i>{dbTptef[tsuids[i]]["handlename"]}{"   uid: "}{tsuids[i].split("_")[1]}
                    </h5>
                </div>)
            tmpData.push(
                <div className="col-sm-12 col-lg-2 p-1 border"><div className="text-center">
                    {Unixtime2String(Number(tsuids[i].split("_")[0]))}
                </div></div>)
            tmpData.push(
                <div className="col-sm-12 col-lg-8 p-1 border"><div className="text-center">
                    {dbTptef[tsuids[i]]["content"]}
                </div></div>)
            const tmpDatum = [];
            //attachment download button
            if (dbTptef[tsuids[i]]["attachment"] != "")
                tmpDatum.push(
                    <button key={1} className="flex-fill btn btn-primary btn-push m-1"
                        onClick={(evt: any) => {
                            dispatchTptef({
                                type: "download",
                                fileName: evt.target.name,
                                func: (_url: any) => window.open(_url, '_blank')
                            })
                        }}
                        name={dbTptef[tsuids[i]]["attachment"]}>
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {dbTptef[tsuids[i]]["attachment"].split("/").pop().slice(0, 16)}
                    </button>)
            //delete button
            if (tsuids[i].split("_")[1] == uid)
                tmpDatum.push(
                    <button key={2} className="flex-fill btn btn-outline-danger rounded-pill btn-push m-1"
                        onClick={(evt: any) => { deleteRemark(evt.target.name) }} name={tsuids[i]}>
                        <i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Delete
                    </button>)
            if (tmpDatum.length > 0)
                tmpData.push(
                    <div className="col-sm-12 col-lg-2 p-1 border">
                        <div className="d-flex flex-column">
                            {tmpDatum}
                        </div>
                    </div>)
            tmpRecord.push(
                <div style={{
                    border: "1px inset silver", borderRadius: "5px", marginBottom: "3px", boxShadow: "2px 2px 1px rgba(60,60,60,0.2)"
                }}><div className="row p-1 px-3">{tmpData}</div></div>)
        }
        return (<div>{tmpRecord}</div>)
    }
    const inputConsole = () => {
        if (uid == "") return (<div className="m-1">{needLoginForm()}</div>)
        return (
            <div className="m-1 p-2" style={{ color: "#CCFFFF", border: "3px double silver", background: "#001111" }}>
                <div className="my-1 d-flex flex-column text-center">
                    <h4>
                        <i className="far fa-user mr-1"></i>
                        {dbMypage["nickname"] ? dbMypage["nickname"] : "窓の民は名無し"}
                    </h4>
                    <h5><i className="far fa-clock mr-1"></i>{jpclockNow}</h5>
                </div>
                <textarea className="form-control my-1" id="tptef_content" rows={6} value={tmpContent}
                    onChange={(evt) => { setTmpContent(evt.target.value) }}></textarea>
                {/* 提出ボタン */}
                <div className="my-1 d-flex flex-column text-center">
                    <button type="button" className="btn btn-warning btn-lg btn-push m-1"
                        onClick={(evt) => { $(document.getElementById("tptef_remarkAttachment")).click() }}>
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {tmpFile == null ? "添付ファイル無し" : tmpFile.name}
                    </button>
                    <input type="file" className="d-none" id={"tptef_remarkAttachment"}
                        onChange={(evt) => { setTmpFile(evt.target.files[0]) }} />
                    {tmpContent == "" ?
                        <button className="btn btn-success btn-lg m-1" disabled>
                            <i className="far fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>×発言を入力してください
                        </button>
                        :
                        <button className="btn btn-success btn-lg btn-push m-1"
                            onClick={() => { remark(); setTmpContent(""); setTmpFile(null); }}>
                            <i className="far fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>発言する
                        </button>
                    }
                </div>
            </div>
        )
    }
    const appBody = () => {
        return (
            <div>
                <div>
                    {tmpSwitch == "room" ?
                        <div className="row p-1 px-3">
                            <div className="col-12 col-lg-6 p-1">
                                <input className="flex-fill form-control form-control-lg" type="text" placeholder="部屋を指定してください" value={tmpText}
                                    onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                            </div>
                            <div className="col-12 col-lg-6 p-1">
                                <div className="form-inline d-flex justify-content-between">
                                    {tmpText == "" ?
                                        <button className="flex-fill btn btn-success btn-lg btn-push m-1" type="button" disabled>
                                            ×部屋名が未入力
                                        </button>
                                        :
                                        <button className="flex-fill btn btn-success btn-lg btn-push m-1" type="button"
                                            onClick={() => {
                                                if (tmpText != "") { setRoom(tmpText); }; setTmpText(""); setTmpSwitch("");
                                            }}>
                                            <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>部屋を移動
                                        </button>
                                    }
                                    <button className="flex-fill btn btn-secondary btn-lg btn-push m-1" type="button"
                                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                        <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>部屋に留まる
                                    </button>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="row p-1 px-3">
                            <div className="col-12 col-lg-3 p-1"></div>
                            <h2 className="col-12 col-lg-6 p-1 text-center tptef-room"
                                style={{ fontFamily: "Impact", color: "black", textShadow: "4px 4px 1px rgba(60,60,60,0.3)" }}>
                                <i className="fab fa-houzz mr-1" style={{ pointerEvents: "none" }}></i>{room}
                            </h2>
                            <div className="col-12 col-lg-3 p-1">
                                <div className="d-flex justify-content-center justify-content-lg-end form-inline">
                                    <button className="btn btn-link btn-lg m-1" type="button"
                                        onClick={() => { setTmpText(room); setTmpSwitch("room"); }}>
                                        <i className="fas fa-exchange-alt mr-1" style={{ pointerEvents: "none" }}></i>部屋を移動
                                    </button>
                                    <i className="fas fa-question-circle fa-2x mx-1 fa-btn-help"
                                        data-toggle="modal" data-target={"#tptef_roomHelpModal"}>
                                    </i>
                                    {/*roomのヘルプモーダル*/}
                                    <div className="modal fade" id={"tptef_roomHelpModal"} role="dialog" aria-hidden="true">
                                        <div className="modal-dialog modal-lg" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header d-flex justify-content-between">
                                                    <h4 className="modal-title">部屋(Room)とは</h4>
                                                    <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                                        <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                                    </button>
                                                </div>
                                                <div className="modal-body d-flex flex-column text-center">
                                                    チャットルームの部屋です。<br />
                                                    完全一致で該当の部屋に移動します。<br />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {threadTable()}
                {inputConsole()}
            </div>
        )
    }
    return (
        <div>
            {appBody()}
        </div>
    )
};

//titleLogo
export const titleLogo = () => {
    return (<div style={{ fontFamily: "Impact", color: "black" }}>チャットアプリ</div>)
}