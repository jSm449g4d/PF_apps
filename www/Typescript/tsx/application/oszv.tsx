import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb } from "../component/firebaseWrapper";
import { stopf5, jpclock } from "../component/util_tsx";

export const AppMain = () => {
    const [uid] = useAuth()
    const [service, setservice] = useState("main")
    const [tmpservice, setTmpservice] = useState(service)
    const [tmpContent, setTmpContent] = useState("")
    const [tmpFile, setTmpFile] = useState(null)

    const [dbOszv_s, dispatchOszv_s] = useDb()
    const [dbMypage, dispatchMypage] = useDb()
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + service }); }, [service])
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
        dispatchOszv_s({
            type: "create", recodes: {
                [Date.now().toString() + "_" + uid]: {
                    handlename: Object.values(dbMypage)[0] ? Object.values<any>(dbMypage)[0]["nickname"] : "None",
                    content: tmpContent
                }
            }, merge: true
        })
    }
    const deleteRemark = (tsuid: string) => {
        if (stopf5.check("2", 500, true) == false) return; // To prevent high freq 
        dispatchOszv_s({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true })
    }

    // renders
    const threadTable = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_s).sort();
        for (var i = 0; i < tsuids.length; i++) {
            const tmpData = [];
            tmpData.push(<td key={1} style={{ textAlign: "center" }}>{dbOszv_s[tsuids[i]]["handlename"]}</td>)
            tmpData.push(<td key={2}>{dbOszv_s[tsuids[i]]["content"]}</td>)
            tmpData.push(<td key={3} style={{ fontSize: "12px", textAlign: "center" }}>
                {tsuids[i].split("_")[0]}<br />{tsuids[i].split("_")[1]}</td>)
            const tmpDatum = [];
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
    const inputConsole = () => {
        if (uid == "") { return (<h5> <i className="fas fa-wind mr-1"></i>Plz login</h5>); };
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
    const appBody = () => {
        return (
            <div className="row">
                <div className="col-3">
                    <div className="d-flex justify-content-between p-1"
                        style={{ backgroundColor: "#f0f6da", border: "3px doublesilver" }}>
                        <div className="m-2">
                            ===VPSdeWP===
                        </div>
                    </div>
                </div>
                <div className="col-9">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-between">
                            <h3 style={{ color: "black" }}>{service}</h3>
                            <div className="form-inline">
                                <input className="form-control form-control-sm" type="text" value={tmpservice}
                                    onChange={(evt) => { setTmpservice(evt.target.value) }} />
                                <button className="btn btn-success btn-sm"
                                    onClick={() => {
                                        if (tmpservice == "") { setTmpservice(service) }
                                        else { setservice(tmpservice) }
                                    }}>
                                    <i className="fas fa-search mr-1" style={{ pointerEvents: "none" }}></i>Room
                        </button>
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">Item#1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="item2-tab" data-toggle="tab" href="#item2" role="tab" aria-controls="item2" aria-selected="false">Item#2</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="item3-tab" data-toggle="tab" href="#item3" role="tab" aria-controls="item3" aria-selected="false">Item#3</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="item1" role="tabpanel" aria-labelledby="item1-tab">
                            {threadTable()}
                            {inputConsole()}
                        </div>
                        <div className="tab-pane fade" id="item2" role="tabpanel" aria-labelledby="item2-tab">This is a text of item#2.</div>
                        <div className="tab-pane fade" id="item3" role="tabpanel" aria-labelledby="item3-tab">This is a text of item#3.</div>
                    </div>
                </div>
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
    return (<h3 style={{ fontFamily: "Century", color: "black" }}>общая система заказа и вызова</h3>)
}