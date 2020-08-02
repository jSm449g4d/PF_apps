import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb, needLoginForm } from "../component/firebaseWrapper";
import { stopf5, jpclock, Query2Dict } from "../component/util_tsx";
import { rejects } from 'assert';
import "../stylecheets/style.sass";
import { string } from 'prop-types';

export const AppMain = () => {
    const [uid] = useAuth()
    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? uid : Query2Dict()["showuid"])
    const [position, setPosition] = useState("client")//client,owner
    const [tmpText, setTmpText] = useState("")
    const [tmpSwitch, setTmpSwitch] = useState("")

    const [dbOszv_s, dispatchOszv_s] = useDb()
    const [dbOszv_c, dispatchOszv_c] = useDb()
    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    useEffect(() => { setShowUid(uid) }, [uid])
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + uid }); }, [uid])
    useEffect(() => { dispatchOszv_c({ type: "setUri", uri: "oszv_c/" + uid }); }, [uid])
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
            type: "create",
            recodes: {
                shopName: newShopName
            },
            merge: true
        })
    }
    const updateItem = (tsuid: string, addDict: any) => {
        if (showUid != uid) return false;
        dispatchOszv_s({ type: "create", recodes: { [tsuid]: Object.assign(Object.assign({}, dbOszv_s[tsuid]), addDict) }, merge: true })
    }

    const addItem = () => {
        if (showUid != uid) return false;
        const tsuid: string = Date.now().toString() + "_" + uid
        dispatchOszv_s({
            type: "create",
            recodes: {
                [tsuid]: {
                    "name": "新しい商品",
                    "image": ""
                }
            },
            merge: true
        })
    }
    const addOrder = (itemTsuid: string = "nullPoi", name: string = "新しい注文", message: string = "新しいMSG") => {
        if (showUid != uid) return false;
        const tsuid: string = Date.now().toString() + "_" + uid
        dispatchOszv_c({
            type: "create",
            recodes: {
                [tsuid]: {
                    "itemTsuid": itemTsuid,
                    "name": name,
                    "message": message
                }
            },
            merge: true
        })
    }
    const itemModal = (tsuid: string, itemName: string) => {
        return (
            <div className="col-sm-6 col-md-4 col-lg-2 oszv-column">
                <a data-toggle="modal" data-target={"#V" + tsuid + "_itemModal"} onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                    <img className="img-fluid" src="/static/img/publicdomainq-0014284zts.jpg" />
                    <h5>{itemName}</h5>
                </a>
                {/*モーダル*/}
                <div className="modal fade" id={"V" + tsuid + "_itemModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h4 className="modal-title">
                                    {position == "client" ?
                                        <div><i className="fas fa-utensils mr-1" style={{ pointerEvents: "none" }}></i>{itemName}</div>
                                        :
                                        <div>
                                            {tmpSwitch == "itemName" ?
                                                <div className="form-inline">
                                                    <input className="form-control form-control-lg m-1" type="text" placeholder="商品名" value={tmpText}
                                                        onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                                                    <button className="btn btn-success btn-lg m-1" type="button"
                                                        onClick={() => { updateItem(tsuid, { "name": tmpText }); setTmpText(""); setTmpSwitch(""); }}>
                                                        <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                                                    </button>
                                                </div>
                                                :
                                                <div>
                                                    <i className="fas fa-utensils mr-1" style={{ pointerEvents: "none" }}></i>{itemName}
                                                    <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                                                        onClick={() => { setTmpText(itemName); setTmpSwitch("itemName"); }}></i>
                                                </div>
                                            }
                                        </div>
                                    }
                                </h4>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img className="img-fluid" src="/static/img/publicdomainq-0014284zts.jpg" />
                                <p />
                                {position == "client" ?
                                    <div className="d-flex flex-column text-center">
                                        <button className="btn btn-success btn-lg m-1" type="button" data-dismiss="modal"
                                            onClick={() => { addOrder(tsuid, itemName) }}>
                                            <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>注文
                                        </button>
                                    </div>
                                    :
                                    <div className="d-flex flex-column text-center">
                                        <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                                            onClick={() => { dispatchOszv_s({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true }) }}>
                                            <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                                        </button>
                                    </div>
                                }
                            </div>
                            <div className="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const orderModal = (tsuid: string, orderName: string, orderMessage: string) => {
        const now: Date = new Date(Number(tsuid.split("_")[0]));
        const timestamp = now.getFullYear() + "年 " + now.getMonth() +
            "月 " + now.getDate() + "日 " + now.getHours() + ": " + now.getMinutes() + ": " + now.getSeconds();
        return (
            <div className="col-12 oszv-column border">
                <a className="row" data-toggle="modal" data-target={"#V" + tsuid + "_orderModal"}>
                    <h5 className="col-sm-12 col-lg-3">{timestamp}</h5>
                    <h4 className="col-sm-12 col-lg-9">名称: {orderName}</h4>
                    <h6 className="col-sm-12 col-lg-12">メッセージ: {orderMessage}</h6>
                </a>
                <div className="modal fade" id={"V" + tsuid + "_orderModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header justify-content-between">
                                <h5 className="modal-title">{orderName}</h5>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img className="img-fluid" src="/static/img/publicdomainq-0014284zts.jpg" />
                                <p />
                                <div className="d-flex flex-column text-center">
                                    <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal">
                                        <i className="fas fa-bell mr-1" style={{ pointerEvents: "none" }}></i>呼び出し
                                    </button>
                                    <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                                        onClick={() => { dispatchOszv_c({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true }) }}>
                                        <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
                <div>
                    {tmpSwitch == "shopName" ?
                        <h2 className="form-inline">
                            <input className="form-control form-control-lg m-1" type="text" placeholder="店舗名" value={tmpText} size={32}
                                onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                            <button className="btn btn-success btn-lg m-1" type="button"
                                onClick={() => { buildShop(tmpText); setTmpText(""); setTmpSwitch(""); }}>
                                <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                                </button>
                            <button className="btn btn-secondary btn-lg m-1" type="button"
                                onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                                </button>
                        </h2>
                        :
                        <h2>
                            <i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage["shopName"]}
                            <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                                onClick={() => { setTmpText(dbMypage["shopName"]); setTmpSwitch("shopName"); }}></i>
                        </h2>
                    }
                </div>
            )
        if (showUid == uid && position == "owner")
            return (
                <button className="btn btn-link mx-2" onClick={() => { buildShop() }}>
                    <h3>店を立てる</h3>
                </button>
            )
        return (<h2>店が存在しません</h2>)
    }
    const itemColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_s).sort();
        for (var i = 0; i < tsuids.length; i++) {
            tmpRecodes.push(itemModal(tsuids[i], dbOszv_s[tsuids[i]]["name"]))
        }
        return (<div className="row">{tmpRecodes}</div>)
    }
    const orderColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_c).sort();
        for (var i = 0; i < tsuids.length; i++) {
            tmpRecodes.push(orderModal(tsuids[i], dbOszv_c[tsuids[i]]["name"], dbOszv_c[tsuids[i]]["message"]))
        }
        return (<div className="row">{tmpRecodes}</div>)
    }
    const appBody = () => {
        if (uid == "") return (<div>{needLoginForm()}</div>)
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-lg-8">{dipsShopName()}</div>
                    <div className="col-sm-12 col-lg-4 text-right">{dispPosition()}</div>
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
                                <button className="btn btn-outline-primary btn-lg rounded-pill col-10" onClick={() => { addItem() }}>
                                    <b>+商品を追加</b>
                                </button>
                                <div className="col-1"></div>
                            </div>
                        }
                        <div className="mt-2">{itemColumn()}</div>
                    </div>
                    <div className="tab-pane fade" id="item2" role="tabpanel" aria-labelledby="item2-tab">
                        <div className="d-flex justify-content-center">
                            <h5><i className="far fa-clock mr-1"></i>{jpclockNow}</h5>
                        </div>
                        <div className="mt-2">{orderColumn()}</div>
                    </div>
                    <div className="tab-pane fade" id="item3" role="tabpanel" aria-labelledby="item3-tab">This is a text of item#3.</div>
                </div>
            </div>
        )
    }
    return (
        <div>
            {position == "client" ?
                <div className="p-2" style={{ backgroundColor: "#efefff" }}>
                    {appBody()}
                </div> :
                <div className="p-2" style={{ backgroundColor: "#ffdfef" }}>
                    {appBody()}
                </div>}
        </div>
    )
};

//titleLogo
export const titleLogo = () => {
    return (<h3 style={{ fontFamily: "Century", color: "black" }}>ウェイターくん</h3>)
    {/*正式名称 */ }
    //return (<h3 style={{ fontFamily: "Century", color: "black" }}>общая система заказа и вызова</h3>)
}