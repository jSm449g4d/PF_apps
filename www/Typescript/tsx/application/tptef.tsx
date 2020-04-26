import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb } from "../component/firebaseWrapper";
import { stopf5, jpclock } from "../component/util_tsx";

export const App_tsx = () => {
    const [uid] = useAuth()
    const [room, setRoom] = useState("main")
    const [tmpRoom, setTmpRoom] = useState(room)
    const [tmpContent, setTmpContent] = useState("")
    const [tmpFile, setTmpFile] = useState(null)

    const [dbTptef, dispatchTptef] = useDb()
    const [dbMypage, dispatchMypage] = useDb()
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
                    handlename: Object.values(dbMypage)[0] ? Object.values<any>(dbMypage)[0]["nickname"] : "None",
                    content: tmpContent,
                    attachmentUri: dispatchTptef({ type: "upload", file: tmpFile }),
                }
            }, merge: true
        })
    }
    const deleteRemark = (tsuid: string) => {
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq 
        dispatchTptef({ type: "erase", uri: dbTptef[tsuid].attachmentUri })
        dispatchTptef({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true })
    }

    // renders
    const threadTable = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbTptef).sort();
        for (var i = 0; i < tsuids.length; i++) {
            const tmpData = [];
            tmpData.push(<td key={1} style={{ textAlign: "center" }}>{dbTptef[tsuids[i]]["handlename"]}</td>)
            tmpData.push(<td key={2}>{dbTptef[tsuids[i]]["content"]}</td>)
            tmpData.push(<td key={3} style={{ fontSize: "12px", textAlign: "center" }}>
                {tsuids[i].split("_")[0]}<br />{tsuids[i].split("_")[1]}</td>)
            const tmpDatum = [];
            //attachment download button
            if (dbTptef[tsuids[i]]["attachmentUri"] != "")
                tmpDatum.push(
                    <button key={1} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => {
                            dispatchTptef({
                                type: "download",
                                uri: evt.target.name,
                                func: (_url: any) => window.open(_url, '_blank')
                            })
                        }}
                        name={dbTptef[tsuids[i]]["attachmentUri"]}>
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {dbTptef[tsuids[i]]["attachmentUri"].split("/").pop().slice(0, 10)}</button>)
            //delete button
            if (tsuids[i].split("_")[1] == uid)
                tmpDatum.push(
                    <button key={2} className="btn btn-outline-danger btn-sm rounded-pill m-1"
                        onClick={(evt: any) => { deleteRemark(evt.target.name) }} name={tsuids[i]}>
                        <i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Del</button>)
            tmpData.push(<td key={4} style={{ textAlign: "center" }}>{tmpDatum}</td>)
            tmpRecodes.push(<tr key={i}>{tmpData}</tr>)
        }
        return (
            <table className="table table-sm table-bordered bg-light">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th style={{ width: "10%" }}>Handlename</th>
                        <th>Content</th>
                        <th style={{ width: "10%" }} >Timestamp/uid</th>
                        <th style={{ width: "15%" }}>Ops</th>
                    </tr>
                </thead>
                <tbody>{tmpRecodes}</tbody>
            </table>
        )
    }
    const submitForms = () => {
        return (
            <div className="mt-2 p-2" style={{ color: "#CCFFFF", border: "3px double silver", background: "#001111" }}>
                <div className="d-flex justify-content-between">
                    <h4>
                        <i className="far fa-user mr-1"></i>
                        {Object.values(dbMypage)[0] ? Object.values<any>(dbMypage)[0]["nickname"] : "None"}
                    </h4>
                    <h5><i className="far fa-clock mr-1"></i>{jpclockNow}</h5>
                    <h5>入力フォーム</h5>
                </div>
                <textarea className="form-control my-1" id="tptef_content" rows={6} value={tmpContent}
                    onChange={(evt) => { setTmpContent(evt.target.value) }}></textarea>
                <div className="my-1 d-flex justify-content-between">
                    <div className="ml-auto">
                        <div className="form-inline">
                            {/* select file */}
                            <button type="button" className="btn btn-warning btn-sm mx-1"
                                onClick={(evt) => { $(evt.currentTarget.children[0]).click(); }}>
                                <input type="file" className="d-none" value=""
                                    onChange={(evt) => { setTmpFile(evt.target.files[0]) }} />
                                <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                                {tmpFile == null ? "Non selected" : tmpFile.name}
                            </button>
                            <button className="btn btn-primary btn-sm mx-1"
                                onClick={() => { remark(); setTmpContent(""); setTmpFile(null); }}>
                                <i className="far fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>Remark
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="p-2 bg-light">
            <div className="d-flex justify-content-between">
                <h3 style={{ fontFamily: "Century", color: "mediumturquoise" }}>TPTEF: Chatroom</h3>
                <h3 style={{ color: "black" }}>{room}</h3>
                <div className="form-inline">
                    <input className="form-control form-control-sm" type="text" value={tmpRoom}
                        onChange={(evt) => { setTmpRoom(evt.target.value) }} />
                    <button className="btn btn-success btn-sm"
                        onClick={() => {
                            if (tmpRoom == "") { setTmpRoom(room) }
                            else { setRoom(tmpRoom) }
                        }}>
                        <i className="fas fa-search mr-1" style={{ pointerEvents: "none" }}></i>Room
                        </button>
                </div>
            </div>
            {threadTable()}
            {/* Input form */}
            {uid == "" ?
                <h5 className="d-flex justify-content-center">
                    <i className="fas fa-wind mr-1"></i>Plz login
                    </h5>
                :
                submitForms()
            }
        </div>
    )
};
