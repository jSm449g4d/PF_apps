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
        if (tmpContent == "") { alert("Plz input content"); return; };
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
        const tmpData = [];
        const tsuids = Object.keys(dbTptef).sort();
        for (var i = 0; i < tsuids.length; i++) {
            tmpData.push(
                <h5 className="col-12 text-center" style={{ borderTop: "3px double silver" }}>
                    <i className="far fa-user mr-1"></i>{dbTptef[tsuids[i]]["handlename"]}{"   uid: "}{tsuids[i].split("_")[1]}
                </h5>)
            tmpData.push(
                <div className="col-sm-12 col-lg-2 text-center border-top">
                    {Unixtime2String(Number(tsuids[i].split("_")[0]))}
                </div>)
            tmpData.push(
                <div className="col-sm-12 col-lg-8 border" style={{ backgroundColor: "whitesmoke" }}>
                    {dbTptef[tsuids[i]]["content"]}
                </div>)
            const tmpDatum = [];
            //attachment download button
            if (dbTptef[tsuids[i]]["attachment"] != "")
                tmpDatum.push(
                    <button key={1} className="btn btn-primary m-1"
                        onClick={(evt: any) => {
                            dispatchTptef({
                                type: "download",
                                fileName: evt.target.name,
                                func: (_url: any) => window.open(_url, '_blank')
                            })
                        }}
                        name={dbTptef[tsuids[i]]["attachment"]}>
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {dbTptef[tsuids[i]]["attachment"].split("/").pop().slice(0, 16)}</button>)
            //delete button
            if (tsuids[i].split("_")[1] == uid)
                tmpDatum.push(
                    <button key={2} className="btn btn-outline-danger rounded-pill m-1"
                        onClick={(evt: any) => { deleteRemark(evt.target.name) }} name={tsuids[i]}>
                        <i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Delete</button>)
            tmpData.push(<div className="col-sm-12 col-lg-2 text-center border-top">{tmpDatum}</div>)
        }
        return (
            <div className="row mx-1">{tmpData}</div>
        )
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
                    <button type="button" className="btn btn-warning btn-lg m-1"
                        onClick={(evt) => { $(evt.currentTarget.children[0]).click(); }}>
                        <input type="file" className="d-none" value=""
                            onChange={(evt) => { setTmpFile(evt.target.files[0]) }} />
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {tmpFile == null ? "添付ファイル無し" : tmpFile.name}
                    </button>
                    <button className="btn btn-primary btn-lg m-1"
                        onClick={() => { remark(); setTmpContent(""); setTmpFile(null); }}>
                        <i className="far fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>発言する
                    </button>
                </div>
            </div>
        )
    }
    const appBody = () => {
        return (
            <div>
                <div>
                    {tmpSwitch == "room" ?
                        <div className="text-center m-1">
                            <input className="form-control form-control-lg m-1" type="text" placeholder="部屋を指定してください" value={tmpText}
                                onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                            <button className="btn btn-success btn-lg m-1" type="button"
                                onClick={() => {
                                    if (tmpText != "") { setRoom(tmpText); }; setTmpText(""); setTmpSwitch("");
                                }}>
                                <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>別の部屋に移動
                                </button>
                            <button className="btn btn-secondary btn-lg m-1" type="button"
                                onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>部屋にとどまる
                                </button>
                        </div>
                        :
                        <div className="d-flex justify-content-center text-center m-1 tptef-room" style={{ color: "black" }}>
                            <div className="form-inline">
                                <h2><i className="fab fa-houzz mr-1" style={{ pointerEvents: "none" }}></i>{room}</h2>
                                <button className="btn btn-link btn-lg m-1" type="button"
                                    onClick={() => { setTmpText(room); setTmpSwitch("room"); }}>
                                    <i className="fas fa-exchange-alt mr-1" style={{ pointerEvents: "none" }}></i>部屋を移動
                            </button>
                                <i className="fas fa-question-circle fa-2x faa-wrench animated-hover mx-1 fa-btn-help"
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
        <div className="p-2 bg-light">
            {appBody()}
        </div>
    )
};

//titleLogo
export const titleLogo = () => {
    return (<h3 style={{ fontFamily: "Century", color: "black" }}>チャットアプリ</h3>)
}