import React, { useState, useEffect } from 'react';
import { stopf5 } from "../component/util_tsx";
import { dbFieldDelete, useAuth, useDb } from "../component/firebaseWrapper";

export const AppMain = () => {

    const [uid] = useAuth()
    const [apiEndpoint, setApiEndpoint] = useState("https://")
    const [serviceName, setServiceName] = useState("カスタム")
    const [craloerResponse, setCraloerResponse] = useState<{ [keys: string]: any }>({})
    const [fields, setFields] = useState<{ [_timestamp: string]: any }>({})

    const [dbNicoapi, dispatchNicoapi] = useDb()
    useEffect(() => { dispatchNicoapi({ type: "setUri", uri: "nicoapi/" + uid }); }, [uid])

    // functions
    const submitOrder = (LimitUrls: number = 300) => {
        const request_urls = [apiEndpoint.replace("?", "") + "?"];
        const timestamp = Object.keys(fields).sort();
        for (let i = 0; i < timestamp.length; i++) {
            if (fields[timestamp[i]]["field"] == "") continue;
            if (fields[timestamp[i]]["value"].indexOf("$for(") == 0) {
                const tmp_for = fields[timestamp[i]]["value"].split(/[(;)]/);
                if (tmp_for.length != 5) { alert("wrong: fields→value"); return; }
                const request_url_length_before = request_urls.length
                for (let j = 0; j < request_url_length_before; j++) {
                    for (let k = Number(tmp_for[1]); k < Number(tmp_for[2]); k += Number(tmp_for[3]))
                        request_urls.push(request_urls[j] + "&" + fields[timestamp[i]]["field"] + "=" + String(k));
                } request_urls.splice(0, request_url_length_before); continue;
            }
            for (let j = 0; j < request_urls.length; j++) {
                request_urls[j] += "&" + fields[timestamp[i]]["field"] + "=" + fields[timestamp[i]]["value"]
            }
        }

        // submit
        if (request_urls.length > LimitUrls) { alert("error: Too many → " + String(request_urls.length) + "[req]"); return; }
        if (confirm(String(request_urls.length) + "[req]\nDo you really want to place ORDER?") == false) return;
        if (stopf5.check("1", 6000, true) == false) return; // To prevent high freq access
        dispatchNicoapi({
            type: "create",
            recodes: {
                [Date.now().toString() + "_" + uid]: {
                    "request_urls": request_urls, "status": "standby",
                    "User-Agent": String(Math.random() * 1000000).split(".")[0]
                }
            },
            merge: true
        })

        // access to backend
        setTimeout(() => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open("POST", "/Flask/nicoapi/main.py", true);
            xhr.onload = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                    setCraloerResponse(JSON.parse(xhr.responseText))
                }
            };
            xhr.send(null);
        }, 1000)

    }

    // renders
    const helpApp = () => {
        return (
            <div className="p-1" style={{ backgroundColor: "wheat", border: "3px double silver" }}>
                <h4 className="d-flex justify-content-center" style={{ fontStyle: "Sylfaen" }}>
                    NicoNicoAPI Wrapper <i className="fab fa-react mx-2"></i>React edition
                </h4>
                <div className="d-flex justify-content-center">
                    <div style={{ textAlign: "center" }}>
                        <h5>使い方</h5>
                        APIエンドポイントを選択or入力してください<br />
                        欲しい条件を入力してください<br />
                        Launchボタンを押すと、バックエンドがクローリングを開始します<br />
                        <i className="fab fa-ubuntu fa-lg mx-2" style={{ color: "darkorange" }}></i>
                        の回転開始は、バックエンドが正常に稼働開始したことを示します<br />
                        暫く待ちます(画面リロードは必要ありません)<br />
                        Ordersのcollapseのtableからzipファイルがダウンロードできます<br />
                        ダウンロード終了後は、GCSのリソース節約の為にファイルを削除してください<br />
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-secondary btn-sm m-2" data-toggle="collapse" data-target="#helpAppCollapse">
                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                    </button>
                </div>
            </div>
        )
    }
    const helpCmd = () => {
        return (
            <div className="p-1" style={{ backgroundColor: "wheat", border: "3px double silver" }}>
                <h4 className="d-flex justify-content-center" style={{ fontStyle: "Sylfaen" }}>
                    Command
                </h4>
                <div className="d-flex justify-content-center">
                    <div style={{ textAlign: "center" }}>
                        <h6>一度に複数のリクエストを行う為の、特殊なvalueの入力方法です。</h6>
                        <h5>$for(A;B;C)</h5>
                        A:開始の数値 B:終了条件の数値(上限) C:インクリメント<br />
                        一度のリクエストで得られるレコード数(limit)が限られる際等に、繰り返し要求を出すときに使用します<br />
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-secondary btn-sm m-2" data-toggle="collapse" data-target="#helpCmdCollapse">
                        <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }}></i>Close
                    </button>
                </div>
            </div>
        )
    }
    const inputConsole = () => {
        const apiEndpointTable = () => {
            return (
                <table className="table table-sm">
                    <thead>
                        <tr style={{ textAlign: "center" }}>
                            <th>Endpoint</th>
                            <th>Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#apiEndpointCollapse"
                                    onClick={() => {
                                        setApiEndpoint("https://api.search.nicovideo.jp/api/v2/video/contents/search")
                                        setServiceName("ニコニコ動画")
                                        setFields({
                                            [String(Date.now() - 5)]: { field: "q", value: "ゆっくり解説" },
                                            [String(Date.now() - 4)]: { field: "targets", value: "title,description,tags" },
                                            [String(Date.now() - 3)]: { field: "fields", value: "contentId,title,description,tags" },
                                            [String(Date.now() - 2)]: { field: "_sort", value: "viewCounter" },
                                            [String(Date.now() - 1)]: { field: "_limit", value: "100" },
                                            [String(Date.now() - 0)]: { field: "_offset", value: "$for(1;1601;100)" },
                                        })
                                    }}>
                                    ニコニコ動画
                            </button>
                            </td>
                            <td>
                                <a href="https://site.nicovideo.jp/search-api-docs/search.html">
                                    https://site.nicovideo.jp/search-api-docs/search.html
                            </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#apiEndpointCollapse"
                                    onClick={() => {
                                        setApiEndpoint("https://api.search.nicovideo.jp/api/v2/live/contents/search")
                                        setServiceName("ニコニコ生放送")
                                        setFields({
                                            [String(Date.now() - 5)]: { field: "q", value: "ゆっくり解説" },
                                            [String(Date.now() - 4)]: { field: "targets", value: "title,description,tags" },
                                            [String(Date.now() - 3)]: { field: "fields", value: "contentId,title,description,tags" },
                                            [String(Date.now() - 2)]: { field: "_sort", value: "viewCounter" },
                                            [String(Date.now() - 1)]: { field: "_limit", value: "100" },
                                            [String(Date.now() - 0)]: { field: "_offset", value: "$for(1;1601;100)" },
                                        })
                                    }}>
                                    ニコニコ生放送
                            </button>
                            </td>
                            <td>
                                <a href="https://site.nicovideo.jp/search-api-docs/search.html">
                                    https://site.nicovideo.jp/search-api-docs/search.html
                            </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#apiEndpointCollapse"
                                    onClick={() => {
                                        setApiEndpoint("https://api.syosetu.com/novelapi/api/")
                                        setServiceName("なろうAPI")
                                        setFields({
                                            [String(Date.now() - 1)]: { field: "lim", value: "499" },
                                            [String(Date.now() - 0)]: { field: "st", value: "$for(1;2000;499)" },
                                        })
                                    }}>
                                    なろうAPI
                            </button>
                            </td>
                            <td>
                                <a href="https://dev.syosetu.com/man/api/">
                                    https://dev.syosetu.com/man/api/
                            </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#apiEndpointCollapse"
                                    onClick={() => {
                                        setApiEndpoint("https://")
                                        setServiceName("カスタム")
                                        setFields({
                                        })
                                    }}>
                                    カスタム
                            </button>
                            </td>
                            <td>
                                <a>
                                    None
                            </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        }
        const apiEndpointNav = () => {
            return (
                <nav className="navbar" style={{ backgroundColor: "paleturquoise" }}>
                    <div className="form-inline">
                        <i className="fas fa-question-circle fa-2x faa-wrench animated-hover mx-1" style={{ color: "darkorange" }}
                            data-toggle="collapse" data-target="#helpAppCollapse">
                        </i>
                        <button className="btn btn-primary mx-1" data-toggle="collapse" data-target="#apiEndpointCollapse">
                            <i className="far fa-caret-square-down mr-1" style={{ pointerEvents: "none" }}></i>APIendpoint
                    </button>
                    </div>
                    <div className="form-inline">
                        <b>{serviceName}</b>
                        <input type="text" className="form-control form-control-sm mx-1" size={60} value={apiEndpoint}
                            onChange={(evt: any) => {
                                setApiEndpoint(evt.target.value);
                                setServiceName("カスタム");
                            }} />
                    </div>
                </nav>)
        }
        const fieldsTable = () => {
            const lauchButton = () => {
                if (Object.keys(fields).length == 0) {
                    return (
                        <button className="btn btn-secondary" onClick={() => { submitOrder(); }} disabled>
                            <i className="fas fa-rocket mr-1" style={{ pointerEvents: "none" }}></i>× PlzFill↑
                        </button>
                    )
                }
                return (
                    <button className="btn btn-success" onClick={() => { submitOrder(); }}>
                        <i className="fas fa-rocket mr-1" style={{ pointerEvents: "none" }}></i>Launch
                    </button>
                )
            }

            const _timestamp = Object.keys(fields).sort();
            const _recode = []; let _fields = Object.assign({}, fields);
            for (let i = 0; i < _timestamp.length; i++) {
                const _data = [];
                //Field (formtext)
                _data.push(<td key={1}><input type="text" className="form-control form-control-sm mx-1"
                    value={fields[_timestamp[i]]["field"]}
                    onChange={(evt: any) => {
                        _fields[evt.target.name]["field"] = evt.target.value; setFields(_fields);
                    }} name={_timestamp[i]} /></td>)
                //Value (textform)
                _data.push(<td key={2}><input type="text" className="form-control form-control-sm mx-1"
                    value={fields[_timestamp[i]]["value"]}
                    onChange={(evt: any) => {
                        _fields[evt.target.name]["value"] = evt.target.value; setFields(_fields);
                    }} name={_timestamp[i]} /></td>)
                //Command (button)
                _data.push(<td key={3}><button className="btn btn-warning btn-sm" style={{ textAlign: "center" }}
                    onClick={(evt: any) => {
                        _fields[evt.target.name]["value"] = "$for(1;1601;500)"; setFields(_fields);
                    }} name={_timestamp[i]}>$for</button></td>)
                //Ops (Delete button)
                _data.push(<td key={4}><button className="btn btn-outline-danger btn-sm rounded-pill" style={{ textAlign: "center" }}
                    onClick={(evt: any) => {
                        delete _fields[evt.target.name]; setFields(_fields);
                    }} name={_timestamp[i]}><i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Del</button></td >)
                _recode.push(<tr key={i}>{_data}</tr>)
            }
            return (
                <table className="table table-sm" style={{ textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>Field</th>
                            <th>Value</th>
                            <th style={{ width: "10%" }}>
                                <i className="fas fa-question-circle fa-lg faa-wrench animated-hover mx-1" style={{ color: "darkorange" }}
                                    data-toggle="collapse" data-target="#helpCmdCollapse"></i>
                            Command
                        </th>
                            <th style={{ width: "8%" }}>Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_recode}
                        <tr><td /><td style={{ color: "rgba(255,255,255,0)" }}>===みつけたね？===</td></tr>
                        <tr>
                            <td />
                            <td>
                                <button className="btn btn-outline-primary rounded-pill" style={{ width: "50%" }}
                                    onClick={() => {
                                        setFields(Object.assign({ [Date.now().toString()]: { field: "", value: "" } }, fields))
                                    }}>
                                    +Add
                                </button>
                            </td>
                            <td colSpan={2}>
                                <div className="form-inline">
                                    {lauchButton()}
                                    {craloerResponse["thread"] == "start" ?
                                        <i className="fab fa-ubuntu fa-2x fa-spin mx-2" style={{ color: "darkorange" }}></i>
                                        :
                                        <i className="fab fa-ubuntu fa-2x mx-2" style={{ color: "darkorange" }}></i>
                                    }
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>)
        }
        return (
            <div>
                <div style={{ backgroundColor: "lightcyan" }}>
                    <div className="collapse" id="helpAppCollapse">
                        {helpApp()}{/* helpAppCollapse*/}
                    </div>
                    {apiEndpointNav()}{/* helpAppCollapse apiEndpointCollapse */}
                    <div className="collapse show" id="apiEndpointCollapse">
                        {apiEndpointTable()}{/* apiEndpointCollapse */}
                    </div>
                    <div className="collapse" id="helpCmdCollapse">
                        {helpCmd()}{/* helpCmdCollapse*/}
                    </div>
                </div>
                {fieldsTable()}
            </div>
        )
    }
    const outputConsole = () => {
        const orderText = () => {
            let _reqs: number = 0; const _tsuids = Object.keys(dbNicoapi);
            for (let i = 0; i < _tsuids.length; i++) {
                _reqs += dbNicoapi[_tsuids[i]]["request_urls"].length
            }
            return (
                <div className="mx-2">
                    {"orders/reqs: " + String(_tsuids.length) + "/" + String(_reqs)}
                </div>
            )
        }
        const orederTable = () => {
            const _tsuids = Object.keys(dbNicoapi).sort();
            const _records = []; const _recodes = Object.assign({}, dbNicoapi);
            for (let i = 0; i < _tsuids.length; i++) {
                const _data = [];
                _data.push(
                    <td key={1}>
                        {_tsuids[i].split("_")[0]}<br />
                    Status: {_recodes[_tsuids[i]]["status"]}<br />
                    UA: {_recodes[_tsuids[i]]["User-Agent"]}
                    </td>)
                _data.push(
                    <td key={2} style={{ fontSize: "12px", textAlign: "left" }}>
                        <details>
                            <summary> {_recodes[_tsuids[i]]["request_urls"][0]}</summary>
                            {_recodes[_tsuids[i]]["request_urls"].slice(1).join('\n')}
                        </details>
                    </td>)
                const _datum = []; {// col: Ops
                    //download button
                    if (_recodes[_tsuids[i]]["status"] == "processed") _datum.push(
                        <button key={1} className="btn btn-primary btn-sm m-1" name={_tsuids[i]}
                            onClick={(evt: any) => {
                                if (stopf5.check("stR_GetOrderZip", 500) == false) return; // To prevent high freq access
                                dispatchNicoapi({
                                    type: "download", fileName: evt.target.name + ".zip",
                                    func: (_url: any) => window.open(_url, '_blank')
                                });
                            }}>
                            <i className="fas fa-cloud-download-alt mr-1" style={{ pointerEvents: "none" }}></i>DL
                    </button>)
                    //attachment download button
                    if (_recodes[_tsuids[i]]["status"] == "processed") _datum.push(
                        <button key={2} className="btn btn-outline-danger btn-sm m-1" name={_tsuids[i]}
                            onClick={(evt: any) => {
                                if (stopf5.check("stD_DelOrderZip", 500) == false) return; // To prevent high freq access
                                dispatchNicoapi({ type: "create", recodes: { [evt.target.name]: dbFieldDelete }, merge: true })
                                dispatchNicoapi({ type: "strageDelete", fileName: evt.target.name + ".zip" })
                            }}>
                            <i className="far fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>Del
                    </button>)
                } _data.push(<td key={3}>{_datum}</td>)
                _records.push(<tr key={i}>{_data}</tr>)
            }
            if (_tsuids.length == 0) { _records.push(<tr><td colSpan={3}>Not Exist</td></tr>); }
            return (
                <table className="table table-sm table-bordered" style={{ textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }} >Timestamp/Info</th>
                            <th>Request URLs</th>
                            <th style={{ width: "8%" }} >Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_records}
                    </tbody>
                </table>
            )
        }
        return (
            <div style={{ backgroundColor: "lightyellow" }}>
                <nav className="navbar" style={{ backgroundColor: "wheat" }}>
                    <div className="form-inline">
                        <button className="btn btn-info btn-sm" data-toggle="collapse" data-target="#ordersCollapse">
                            <i className="far fa-file-alt mr-1" style={{ pointerEvents: "none" }}></i>Orders
                        </button>
                        {orderText()}
                    </div>
                </nav>
                <div className="collapse" id="ordersCollapse">
                    {orederTable()}
                </div>
            </div>
        )
    }
    const appBody = () => {
        if (uid == "") { return (<h5><i className="fas fa-wind mr-1"></i>Plz login</h5>); };
        return (
            <div>
                {inputConsole()}
                {outputConsole()}
            </div>
        )
    }
    return (
        <div className="p-1 bg-light">
            <div>{appBody()}</div>
        </div>
    );
};
