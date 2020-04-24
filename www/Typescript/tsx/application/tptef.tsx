import React, { useState, useEffect } from 'react';
import { fb, fb_errmsg, useAuth } from "../component/account";
import { stopf5, jpclock, dbUriCheck } from "../component/util_tsx";

const storage = fb.storage();
const db = fb.firestore();

export const App_tsx = () => {
    const [uid,] = useAuth()
    const [room, setRoom] = useState("main")
    const [tmpRoom, setTmpRoom] = useState(room)
    const [tmpContent, setTmpContent] = useState("")
    const [tmpFile, setTmpFile] = useState(null)
    const [dbMypage, setDbMypage] = useState<{ [tptef: string]: any }>({ "_": { "nickname": "nanasi" } })
    const [dbTptef, setDbTptef] = useState<{ [tptef: string]: any }>({})
    const [jpclockNow, setJpclockNow] = useState("")
    const [useInterval, setUseInterval] = React.useState(new Date());
    // FirebaseSnapping
    useEffect(() => {
        const _snaps = [
            dbRead("mypage/" + uid, setDbMypage),
            dbRead("tptef/" + room, setDbTptef),]
        return () => { for (let i = 0; i < _snaps.length; i++) { _snaps[i](); } }
    }, [uid, room])
    // setInterval
    useEffect(() => {
        const _intervalId = setInterval(() => {
            _tick();
            setUseInterval(new Date());
        }, 100);
        return () => { clearInterval(_intervalId) };
    }, [useInterval]);

    function dbCreate(uri: string, upRecodes: { [tsuid: string]: any }, margeFlag: boolean = false, ) {
        if (dbUriCheck(uri) == false) return
        db.doc(uri).set(upRecodes, { merge: margeFlag }).catch((err) => { fb_errmsg(err) })
    }
    function dbRead(uri: string, setDbRecodes: any, afterFunc: any = () => { }) {
        const _setDb: any = (recodes: any) => { setDbRecodes(recodes); afterFunc(); }
        if (dbUriCheck(uri) == false) { _setDb({}); return () => { } }
        return db.doc(uri).onSnapshot((doc) => {
            if (doc.exists) { _setDb(doc.data()); } else { _setDb({}); }
        });
    }
    function strageCreate(uri: string, upFile: any) {
        if (dbUriCheck(uri) == false) { return () => { } }
        storage.ref(uri).put(upFile).catch((err) => { fb_errmsg(err) })
    }

    // functions
    function remark() {
        if (tmpContent == "") { alert("Plz input content"); return; };
        if (stopf5.check("dbC_AddRemark", 500, true) == false) return; // To prevent high freq access

        let _attachmentUri: string = "";
        if (tmpFile) {
            _attachmentUri = "tptef/" + uid + "/" + tmpFile.name;
            strageCreate(_attachmentUri, tmpFile)
        }
        dbCreate("tptef/" + room, {
            [Date.now().toString() + "_" + uid]: {
                // FIXME: Verbose
                handlename: 0 < Object.values(dbMypage).length ? Object.values(dbMypage)[0]["nickname"] : "None",
                content: tmpContent,
                attachmentUri: _attachmentUri,
            }
        }, true);
    }
    function dbC_DelRemark(tsuid: string) {
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq access
        stD_DelAttachment(dbTptef[tsuid]["attachmentUri"])
        dbCreate("tptef/" + room, { [tsuid]: fb.firestore.FieldValue.delete() }, true);
        if (Object.keys(dbTptef).length < 2) dbD_DelRoom();
    }
    function dbD_DelRoom() {
        db.doc("tptef/" + room).delete().catch((err) => { fb_errmsg(err) })
    }
    function stR_GetAttachment(attachmentUri: string) {
        storage.ref(attachmentUri).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        }).catch((err) => { fb_errmsg(err) });
    }
    function stD_DelAttachment(attachmentUri: string) {
        if (attachmentUri == "") return;
        storage.ref(attachmentUri).delete().catch((err) => { fb_errmsg(err) })
    }
    function _tick() {
        // Clock
        setJpclockNow(jpclock())
    }

    // renders
    function render_thread_table() {
        const tmp_recodes = [];
        const tsuids = Object.keys(dbTptef).sort();
        for (var i = 0; i < tsuids.length; i++) {
            const tmp_data = [];
            tmp_data.push(<td key={1} style={{ textAlign: "center" }}>{dbTptef[tsuids[i]]["handlename"]}</td>)
            tmp_data.push(<td key={2}>{dbTptef[tsuids[i]]["content"]}</td>)
            tmp_data.push(<td key={3} style={{ fontSize: "12px", textAlign: "center" }}>
                {tsuids[i].split("_")[0]}<br />{tsuids[i].split("_")[1]}</td>)
            const tmp_datum = []; {
                //attachment download button
                if (dbTptef[tsuids[i]]["attachmentUri"] != "") tmp_datum.push(
                    <button key={1} className="btn btn-primary btn-sm m-1"
                        onClick={(evt: any) => { stR_GetAttachment(evt.target.name) }}
                        name={dbTptef[tsuids[i]]["attachmentUri"]}>
                        <i className="fas fa-paperclip mr-1" style={{ pointerEvents: "none" }}></i>
                        {dbTptef[tsuids[i]]["attachmentUri"].split("/").pop().slice(0, 10)}</button>)
                //delete button
                if (tsuids[i].split("_")[1] == uid) tmp_datum.push(
                    <button key={2} className="btn btn-outline-danger btn-sm rounded-pill m-1"
                        onClick={(evt: any) => { dbC_DelRemark(evt.target.name) }} name={tsuids[i]}>
                        <i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Del</button>)
            }
            tmp_data.push(<td key={4} style={{ textAlign: "center" }}>{tmp_datum}</td>)
            tmp_recodes.push(<tr key={i}>{tmp_data}</tr>)
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
                <tbody>{tmp_recodes}</tbody>
            </table>
        )
    }
    function render_submit_forms() {
        return (
            <div className="mt-2 p-2" style={{ color: "#CCFFFF", border: "3px double silver", background: "#001111" }}>
                <div className="d-flex justify-content-between">
                    <h4><i className="far fa-user mr-1"></i>{// FIXME: Verbose
                        0 < Object.values(dbMypage).length ? Object.values(dbMypage)[0]["nickname"] : "None"
                    }</h4>
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
            {render_thread_table()}
            {/* Input form */}
            {uid == "" ?
                <h5 className="d-flex justify-content-center">
                    <i className="fas fa-wind mr-1"></i>Plz login
                    </h5>
                :
                render_submit_forms()
            }
        </div>
    )
};
