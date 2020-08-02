import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb, needLoginForm } from "../component/firebaseWrapper";
import { stopf5, jpclock, Query2Dict } from "../component/util_tsx";
import { rejects } from 'assert';
import "../stylecheets/style.sass";

export const AppMain = () => {
    const [uid] = useAuth()
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? uid : Query2Dict()["showuid"])
    const [tmpContent, setTmpContent] = useState("")
    const [tmpFile, setTmpFile] = useState(null)
    const [position, setPosition] = useState("client")//client,owner
    const [tmpShopName, setTmpShopName] = useState("")

    const [dbOszv_s, dispatchOszv_s] = useDb()
    const [dbOszv_c, dispatchOszv_c] = useDb()
    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    useEffect(() => { setShowUid(uid) }, [uid])
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + uid }); }, [uid])
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_c/" + uid }); }, [uid])
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + showUid }); setPosition("client") }, [showUid])

    // jpclock (decoration)
    const [jpclockNow, setJpclockNow] = useState("")
    useEffect(() => {
        const _intervalId = setInterval(() => setJpclockNow(jpclock()), 500);
        return () => clearInterval(_intervalId);
    }, []);

    const buildShop = (newShopName: string = "とある飲食店") => {
        if (showUid != uid) return false;
        dispatchMypage({
            type: "create", recodes: {
                shopName: newShopName
            }, merge: true
        })

    }

    const itemModal = (num: string) => {
        return (
            <div className="col-sm-6 col-md-4 col-lg-2 oszv-column">
                <a data-toggle="modal" data-target={"#" + num + "_modal"}>
                    <img className="img-fluid" src="/static/img/publicdomainq-0014284zts.jpg" />
                    写真付きのメニュー{num}
                </a>
                {/*モーダルの内容*/}
                <div className="modal fade" id={num + "_modal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h5 className="modal-title">{num}</h5>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                            </div>
                            <div className="modal-footer d-flex justify-content-between">
                                {position == "client" ? <div></div>
                                    :
                                    <button className="btn btn-warning m-2" type="button" data-dismiss="modal">
                                        <i className="fas fa-wrench mr-1" style={{ pointerEvents: "none" }}></i>編集
                                    </button>
                                }
                                {position == "client" ?
                                    <button className="btn btn-success m-2" type="button" data-dismiss="modal">
                                        <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>注文
                                    </button>
                                    :
                                    <button className="btn btn-danger m-2" type="button" data-dismiss="modal">
                                        <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const orderModal = (num: string) => {
        return (
            <div className="col-12 oszv-column">
                <a className="row" data-toggle="modal" data-target={"#" + num + "_modal"}>
                    <div className="col-sm-12 col-lg-6">名称{num}</div>
                    <div className="col-sm-12 col-lg-6">コンソール{num}</div>
                </a>
                <div className="modal fade" id={num + "_modal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header justify-content-between">
                                <h5 className="modal-title">{num}</h5>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                            </div>
                            <div className="modal-footer d-flex justify-content-between">
                                <button className="btn btn-warning m-2" type="button" data-dismiss="modal">
                                    <i className="fas fa-bell mr-1" style={{ pointerEvents: "none" }}></i>呼び出し
                                </button>
                                <button className="btn btn-danger m-2" type="button" data-dismiss="modal">
                                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const addItem = () => {
        if (showUid != uid) return false;
        dispatchOszv_s({
            [Date.now().toString() + "_" + uid]: {
                "name": "新しい商品", "image": ""
            }, merge: true
        })
    }
    // renders
    const dispPosition = () => {
        if (position == "owner")
            return (
                <div>現在: <b>店主</b>
                    <button className="btn btn-link btn-sm ml-5" onClick={() => { setPosition("client") }}>
                        客として操作
                    </button>
                </div>
            )
        if (position != "client") return (<div>Error Position!</div>)
        if (showUid == uid)
            return (
                <div>現在: <b>客</b>
                    <button className="btn btn-link btn-sm ml-5" onClick={() => { setPosition("owner") }}>
                        店主として操作
                    </button>
                </div>
            )
        if (showUid != uid)
            return (
                <div>現在: <b>客</b>
                    <button className="btn btn-link btn-sm ml-5" onClick={() => { setPosition("client"); setShowUid(uid) }}>
                        自分の店に行く
                    </button>
                </div>
            )
    }
    const dipsShopName = () => {
        if (showUid == "") return (<h2>店がありません</h2>)
        if (dbMypage["shopName"] && position == "client")
            return (<h2><i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage["shopName"]}</h2>)
        if (dbMypage["shopName"] && position == "owner")
            return (
                <h2>
                    {/*Title*/}
                    <i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage["shopName"]}
                    <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                        data-toggle="modal" data-target="#changeShopName_modal"></i>
                    {/*changeShopName_Modal */}
                    <div className="modal fade" id="changeShopName_modal" role="dialog" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header justify-content-between">
                                    <h5 className="modal-title">
                                        <i className="fas fa-pencil-alt mr-1" style={{ pointerEvents: "none" }}></i>
                                        店名の変更
                                        </h5>
                                    <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                        <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <h6><i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i> {dbMypage["shopName"]}</h6>
                                    <div className="d-flex flex-column text-center">
                                        <input className="form-control form-control-lg m-1" type="text" placeholder="新しい店名"
                                            onChange={(evt: any) => { setTmpShopName(evt.target.value); }} />
                                        {(tmpShopName == "") ?
                                            <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal" disabled>
                                                <b>×店名を入力してください</b>
                                            </button>
                                            :
                                            <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal"
                                                onClick={() => { buildShop(tmpShopName); }}>
                                                <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>
                                                新しい店名を送信
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </h2>
            )
        if (showUid == uid && position == "owner")
            return (
                <button className="btn btn-link mx-2" onClick={() => { buildShop() }}>
                    <h3>店を立てる</h3>
                </button>
            )
        return (<h2>店が存在しません</h2>)
    }
    const orderColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_s).sort();
        for (var i = 0; i < 1 + tsuids.length; i++) {
            tmpRecodes.push(orderModal("Rv"))
            tmpRecodes.push(orderModal("RF"))
        }
        return (<div className="row">{tmpRecodes}</div>)
    }
    const appBody = () => {
        if (uid == "") return (<div>{needLoginForm()}</div>)
        return (
            <div>
                <div className="d-flex justify-content-between">
                    {dipsShopName()}
                    <div className="form-inline">{dispPosition()}</div>
                </div>
                <ul className="nav nav-tabs nav-fill mb-2" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">
                            <b>商品</b>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="item2-tab" data-toggle="tab" href="#item2" role="tab" aria-controls="item2" aria-selected="false">
                            <b>注文</b>
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane fade show active" id="item1" role="tabpanel" aria-labelledby="item1-tab">
                        {position == "client" ?
                            <div></div>
                            :
                            <div className="row">
                                <div className="col-1"></div>
                                <button className="btn btn-outline-primary btn-lg rounded-pill col-10" onClick={() => { }}>
                                    <b>+商品を追加</b>
                                </button>
                                <div className="col-1"></div>
                            </div>
                        }
                        <div className="row mt-2">
                            {itemModal("s")}{itemModal("sa")}{itemModal("sv")}
                            {itemModal("ss")}{itemModal("ssa")}{itemModal("ssv")}
                            {itemModal("sss")}{itemModal("sssa")}{itemModal("sssv")}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="item2" role="tabpanel" aria-labelledby="item2-tab">
                        <div className="d-flex justify-content-center">
                            <h5><i className="far fa-clock mr-1"></i>{jpclockNow}</h5>
                        </div>
                        {orderColumn()}
                    </div>
                    <div className="tab-pane fade" id="item3" role="tabpanel" aria-labelledby="item3-tab">This is a text of item#3.</div>
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
    return (<h3 style={{ fontFamily: "Century", color: "black" }}>ウェイターくん</h3>)
    {/*正式名称 */ }
    //return (<h3 style={{ fontFamily: "Century", color: "black" }}>общая система заказа и вызова</h3>)
}