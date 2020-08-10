import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb, needLoginForm, easyIn } from "../component/firebaseWrapper";
import { stopf5, Query2Dict, Unixtime2String } from "../component/util_tsx";
import "../stylecheets/style.sass";

export const AppMain = () => {
    const [uid] = useAuth()

    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? uid : Query2Dict()["showuid"])
    const [tmpText, setTmpText] = useState("")
    const [tmpSwitch, setTmpSwitch] = useState("")

    const [dbOszv_s, dispatchOszv_s] = useDb()
    const [dbOszv_c, dispatchOszv_c] = useDb()
    const [dbMypage, dispatchMypage] = useDb() //notTsuidDb
    const [dbAppindex_oszv_tag, dispatchAppindex_oszv_tag] = useDb() //notTsuidDb
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + showUid }); }, [showUid])
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + showUid }); }, [showUid])
    useEffect(() => { dispatchOszv_c({ type: "setUri", uri: "oszv_c/" + uid }); }, [uid])
    useEffect(() => { dispatchAppindex_oszv_tag({ type: "setUri", uri: "appindex/oszv_tag" }); }, [uid])


    const updateShop = (addDict: any) => {
        if (showUid != uid) return false;
        dispatchMypage({ type: "create", recodes: Object.assign({ "shopName": "新しい店" }, addDict), merge: true })
    }
    const updateItem = (tsuid: string, addDict: any) => {
        if (showUid != uid) return false;
        dispatchOszv_s({ type: "create", recodes: { [tsuid]: Object.assign(Object.assign({}, dbOszv_s[tsuid]), addDict) }, merge: true })
    }
    const dbOperate = (sendCreate: any = {}) => {
        // access to backend
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("POST", "/Flask/oszv/main.py", true);
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) console.log(xhr.responseText);
        };
        xhr.send(JSON.stringify(sendCreate));
    }
    const updateOrder = (tsuid: string, addDict: any) => {
        // [tsuid(client)]: itemTsuid(Owner),
        const itemTsuid: string = dbOszv_c[tsuid]["itemTsuid"]
        dbOperate({
            type: "create",
            uri: "oszv_c/" + tsuid.split("_")[1],
            recodes: { [tsuid]: Object.assign(Object.assign({}, dbOszv_c[tsuid]), addDict) }
        })
        dbOperate({
            type: "create",
            uri: "oszv_c/" + itemTsuid.split("_")[1],
            recodes: { [tsuid]: Object.assign(Object.assign({}, dbOszv_c[tsuid]), addDict) }
        })
    }
    const showImage = (imageUrl: string = "/static/img/publicdomainq-0014284zts.jpg", _height: string = "200px") => {
        if (imageUrl == "")
            return (
                <h4 className="d-flex flex-column text-center img-thumbnail" style={{ backgroundColor: "snow", height: _height, objectFit: "contain" }} >
                    <i className="fab fa-themeisle fa-2x m-2"></i>No Image
                </h4>)
        return (<div className="d-flex flex-column text-center img-thumbnail"><img className="img-fluid" src={imageUrl} alt={imageUrl}
            style={{ backgroundColor: "snow", height: _height, objectFit: "contain" }} /></div>)
    }
    const updateImage = (tsuid: string) => {
        dispatchOszv_s({
            type: "download", fileName: tsuid + ".img",
            func: (_url: any) => { if (_url != dbOszv_s["imageUrl"]) updateItem(tsuid, { "imageUrl": _url }) }
        })

    }
    const updateImageAll = () => {
        if (showUid != uid) return;
        const tsuids = Object.keys(dbOszv_s).sort();
        for (let i = 0; i < tsuids.length; i++) {
            updateImage(tsuids[i])
        }
    }
    const uploadImage = (tsuid: string, imageUrl = "") => {
        if (showUid != uid) return (<div></div>);
        return (
            <div className="m-2">
                {/*削除*/}
                {imageUrl == "" ?
                    <div className="d-flex flex-column text-center">
                        {/*アップロード*/}
                        <button className="btn btn-warning btn-lg" type="button"
                            onClick={(evt) => { $(document.getElementById("Uc" + tsuid + "_uploadImage")).click() }
                            }>
                            <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>画像を投稿
                        </button>
                        <input type="file" className="d-none" accept="image/jpeg,image/png" id={"Uc" + tsuid + "_uploadImage"} name={tsuid}
                            onChange={(evt) => {
                                dispatchOszv_s({ type: "upload", file: evt.target.files[0], fileName: evt.target.name + ".img" })
                                updateItem(tsuid, { "imageUrl": evt.target.files[0].name })
                            }} />
                    </div>
                    :
                    <div className="d-flex justify-content-between text-center">
                        {/*アップロード*/}
                        <button className="flex-fill btn btn-warning btn-lg mx-1" type="button"
                            onClick={(evt) => { $(document.getElementById("Uc" + tsuid + "_uploadImage")).click() }
                            }>
                            <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>画像を投稿
                            </button>
                        <input type="file" className="d-none" accept="image/jpeg,image/png" id={"Uc" + tsuid + "_uploadImage"} name={tsuid}
                            onChange={(evt) => {
                                dispatchOszv_s({ type: "upload", file: evt.target.files[0], fileName: evt.target.name + ".img" })
                                updateItem(tsuid, { "imageUrl": evt.target.files[0].name })
                                setTimeout(() => updateImage(tsuid), 2000)
                            }} />
                        <button className="flex-fill btn btn-outline-danger btn-lg mx-1" type="button"
                            onClick={(evt) => {
                                dispatchOszv_s({ type: "strageDelete", fileName: tsuid + ".img" })
                                setTimeout(() => updateImage(tsuid), 2000)
                            }}>
                            <i className="fas fa-eraser mr-1" style={{ pointerEvents: "none" }}></i>画像を削除
                            </button>
                    </div>
                }
            </div>
        )
    }
    const addItemButtonZwei = () => {
        if (showUid != uid) return (<div></div>);
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-9 d-flex flex-column">
                        <button className="btn btn-primary btn-lg rounded-pill m-1" data-toggle="modal" data-target={"#V" + "_addItemModal"}
                            onClick={() => {
                                setTmpText("新しい商品"); setTmpSwitch("itemName");
                                const _tsuid = Date.now().toString() + "_" + uid
                                updateItem(_tsuid, { "name": "新しい商品", "imageUrl": "", "description": "詳細はありません" })
                                setTimeout(() => document.getElementById("A" + _tsuid + "_itemModal").click(), 800)
                            }}>
                            <b>+商品を追加</b>
                        </button>
                    </div>
                    <div className="col-sm-12 col-md-5 col-lg-3 d-flex flex-column">
                        <button className="btn btn-secondary btn-lg rounded-pill m-1" type="button"
                            onClick={() => { updateImageAll(); }}>
                            <i className="fas fa-redo mr-1" style={{ pointerEvents: "none" }}></i>画像を更新
                    </button>
                    </div>
                </div>
            </div>
        )
    }
    const addOrder = (itemTsuid: string = "nullPoi", name: string = "新しい注文", message: string = "無し", imageUrl: string = "", description: string = "") => {
        if (showUid == uid) return false;
        const tsuid: string = Date.now().toString() + "_" + uid
        dbOperate({
            type: "create",
            uri: "oszv_c/" + tsuid.split("_")[1],
            recodes: {
                [tsuid]: {
                    "itemTsuid": itemTsuid,
                    "name": name,
                    "message": message,
                    "imageUrl": imageUrl,
                    "status": "ordering",
                    "description": description
                }
            }
        })
        dbOperate({
            type: "create",
            uri: "oszv_c/" + itemTsuid.split("_")[1],
            recodes: {
                [tsuid]: {
                    "itemTsuid": itemTsuid,
                    "name": name,
                    "message": message,
                    "imageUrl": imageUrl,
                    "status": "ordering",
                    "description": description
                }
            }
        })
    }
    const deleteOrder = (tsuid: string) => {
        // [tsuid(client)]: itemTsuid(Owner),
        const itemTsuid: string = dbOszv_c[tsuid]["itemTsuid"]
        dbOperate({
            type: "delete",
            uri: "oszv_c/" + tsuid.split("_")[1],
            recodes: { [tsuid]: "dbFieldDelete" }
        })
        dbOperate({
            type: "delete",
            uri: "oszv_c/" + itemTsuid.split("_")[1],
            recodes: { [tsuid]: "dbFieldDelete" }
        })
    }
    const itemModal = (tsuid: string, itemName: string, imageUrl: string = "", itemDescription: string = "") => {
        const showDescription = (_itemDescription: string = "") => {
            if (uid != showUid) return (
                <div className="m-1 d-flex flex-column text-center" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                    <h4>商品詳細</h4>
                    {_itemDescription}
                </div>)
            if (uid == showUid && tmpSwitch == "itemDescription") return (
                <div className="m-1 d-flex flex-column text-center" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                    <h4>商品詳細</h4>
                    <textarea className="form-control m-1" rows={5} value={tmpText}
                        onChange={(evt: any) => { setTmpText(evt.target.value) }}></textarea>
                    <div className="d-flex">
                        <button className="flex-fill btn btn-success btn-lg m-1" type="button"
                            onClick={() => { updateItem(tsuid, { "description": tmpText }); setTmpText(""); setTmpSwitch(""); }}>
                            <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                    </button>
                        <button className="flex-fill btn btn-secondary btn-lg m-1" type="button"
                            onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                            <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                    </button>
                    </div>
                </div>)
            if (uid == showUid) return (
                <div className="m-1 d-flex flex-column text-center" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                    <h4>商品詳細
                        <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2 fa-btn"
                            onClick={() => { setTmpText(_itemDescription); setTmpSwitch("itemDescription"); }}></i>
                    </h4>
                    {_itemDescription}
                </div>)
            return (<div></div>)
        }
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 oszv-column">
                {/*将棋盤のボタン(#A)*/}
                <div className="btn-push">
                    <a className="" data-toggle="modal" id={"A" + tsuid + "_itemModal"} data-target={"#V" + tsuid + "_itemModal"}
                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                        {showImage(imageUrl)}
                        <h5 className="d-flex flex-column text-center mt-1" style={{ backgroundColor: "rgba(255,255,255,0.4)" }}>{itemName}</h5>
                    </a>
                </div>
                {/*注文モーダル(#V)*/}
                <div className="modal fade" id={"V" + tsuid + "_itemModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex">
                                <h3 className="modal-title flex-grow-1">
                                    {uid != showUid ?
                                        <div><i className="fas fa-utensils mr-1" style={{ pointerEvents: "none" }}></i>{itemName}</div>
                                        :
                                        <div className="">
                                            {tmpSwitch == "itemName" ?
                                                <div className="form-inline">
                                                    <input className="form-control form-control-lg m-1" type="text" placeholder="商品名" value={tmpText}
                                                        onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                                                    <button className="btn btn-success btn-lg m-1" type="button"
                                                        onClick={() => { updateItem(tsuid, { "name": tmpText }); setTmpText(""); setTmpSwitch(""); }}>
                                                        変更
                                                    </button>
                                                    <button className="btn btn-secondary btn-lg m-1" type="button"
                                                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                                        変更中止
                                                    </button>
                                                </div>
                                                :
                                                <div>
                                                    <i className="fas fa-utensils mr-1" style={{ pointerEvents: "none" }}></i>{itemName}
                                                    <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2 fa-btn"
                                                        onClick={() => { setTmpText(itemName); setTmpSwitch("itemName"); }}></i>
                                                </div>
                                            }
                                        </div>
                                    }
                                </h3>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {showImage(imageUrl, "300px")}
                                {showDescription(itemDescription)}
                                {uid != showUid ?
                                    <div className="d-flex flex-column text-center">
                                        <button className="btn btn-success btn-lg m-1" type="button" data-dismiss="modal"
                                            onClick={(evt) => {
                                                addOrder(tsuid, itemName, "メッセージはありません", imageUrl, itemDescription);
                                                $(document.getElementById("Cc" + tsuid + "_itemModal")).click();
                                            }}>
                                            <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>注文
                                        </button>
                                        <button type="button" id={"Cc" + tsuid + "_itemModal"} className="d-none" data-toggle="modal" data-target={"#C" + tsuid + "_itemModal"} />
                                    </div>
                                    :
                                    <div className="d-flex flex-column text-center">
                                        {uploadImage(tsuid, imageUrl)}
                                        <button className="btn btn-success btn-lg m-2" type="button" data-dismiss="modal"
                                            onClick={(evt) => { updateImage(tsuid) }}>
                                            <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>編集完了
                                        </button>
                                        <button className="btn btn-danger btn-lg m-3" type="button" data-dismiss="modal"
                                            onClick={(evt) => {
                                                dispatchOszv_s({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true });
                                                dispatchOszv_s({ type: "strageDelete", fileName: tsuid + ".img" })
                                            }}>
                                            <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/*注文確認(#C)*/}
                <div className="modal fade" id={"C" + tsuid + "_itemModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h4 className="modal-title">注文確認</h4>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body d-flex flex-column text-center">
                                <h5>注文を確定しました</h5>
                                <p />
                                <button className="btn btn-outline-secondary btn-lg" type="button" data-dismiss="modal">
                                    戻る
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const orderModal = (tsuid: string, orderName: string, orderMessage: string, orderImage: string = "", orderStatus: string = "", orderDescription: string = "") => {
        const tailConsoleButtons = []
        if (orderStatus == "ordering" && uid != showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-warning btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceling" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>キャンセル申請
                </button>
            </div>)
        if (orderStatus == "canceling" && uid != showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-warning btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "ordering" }); }}>
                    <i className="fas fa-recycle mr-1" style={{ pointerEvents: "none" }}></i>キャンセル中止
                </button>
            </div>)
        if (orderStatus == "canceled" && uid != showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "accepted" && uid != showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "ordering" && uid == showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-primary btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "accepted" }); }}>
                    <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>取引を承認
                </button>
                <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceled" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>取引キャンセル
                </button>
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "canceling" && uid == showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-primary btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "accepted" }); }}>
                    <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>取引を承認
                </button>
                <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceled" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>取引キャンセル
                </button>
            </div>)
        if (orderStatus == "canceled" && uid == showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "accepted" && uid == showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)

        return (
            <div className="col-12 oszv-column" style={{ marginBottom: "1px", borderBottom: "2px inset gray", borderTop: "2px inset gray" }}>
                <div className="btn-push">
                    <a className="row" data-toggle="modal" data-target={"#V" + tsuid + "_orderModal"}>
                        <div className="col-sm-5 col-lg-3">
                            {orderStatus == "ordering" ? <h3 style={{ color: "darkcyan" }}>取引中</h3> : <div></div>}
                            {orderStatus == "canceling" ? <h3 style={{ color: "chocolate" }}>キャンセル申請中</h3> : <div></div>}
                            {orderStatus == "canceled" ? <h3 style={{ color: "darkred" }}>キャンセル済</h3> : <div></div>}
                            {orderStatus == "accepted" ? <h3 style={{ color: "darkblue" }}>取引済</h3> : <div></div>}
                        </div>
                        <h4 className="col-sm-7 col-lg-6">{orderName}</h4>
                        <h5 className="col-sm-12 col-lg-3">{Unixtime2String(Number(tsuid.split("_")[0]))}</h5>
                        <h6 className="col-sm-12 col-lg-12">メッセージ: {orderMessage}</h6>
                    </a>
                </div>
                <div className="modal fade" id={"V" + tsuid + "_orderModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header justify-content-between">
                                <h4 className="modal-title">{orderName}</h4>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body d-flex flex-column text-center">
                                {showImage(orderImage, "300px")}
                                <p />
                                <div className="p-1 m-1" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                                    <h4>商品詳細</h4>
                                    <div>{orderDescription}</div>
                                </div>
                                <div className="p-1 m-1" style={{ backgroundColor: "snow", border: "3px double silver" }}>
                                    {tmpSwitch == "orderMessage" ?
                                        <div className="d-flex flex-column text-center">
                                            <h4>Message</h4>
                                            <textarea className="form-control" rows={4} value={tmpText}
                                                onChange={(evt: any) => { setTmpText(evt.target.value) }}></textarea>
                                            <div className="d-flex">
                                                <button className=" flex-fill btn btn-success btn-lg m-1" type="button"
                                                    onClick={() => {
                                                        updateOrder(tsuid, { "message": tmpText });
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
                                        :
                                        <div>
                                            <h4><i className="fas fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>Message
                                                <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2 fa-btn"
                                                    onClick={() => { setTmpText(orderMessage); setTmpSwitch("orderMessage"); }}></i>
                                            </h4>
                                            <div>{orderMessage}</div>
                                        </div>
                                    }
                                </div>
                                {tailConsoleButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // renders
    const switchAuth = () => {
        const checkPortfolioShopUid = () => {
            if (dbAppindex_oszv_tag["portfolioShopUid"] == null || dbAppindex_oszv_tag["portfolioShopUid"] == "")
                return (
                    <div className="m-1 p-2" style={{ border: "3px double silver", background: "darkblue", color: "white" }}>
                        <div className="d-flex flex-column text-center">
                            <h3 style={{ color: "red" }}><i className="fas fa-hard-hat mr-1"></i>«portfolioShopUid» не ставится</h3>
                            <h4>процедура</h4>
                            <div>1. Нажмите «出品者1»</div>
                            <button className="btn btn-warning btn-lg m-1"
                                onClick={() => { dispatchAppindex_oszv_tag({ type: "create", recodes: { "portfolioShopUid": uid }, merge: true }) }}>
                                2. регистр «PortfolioShopUid == uid»
                            </button>
                            <h5>Дополнительные настройки</h5>
                            <button className="btn btn-warning btn-lg m-1"
                                onClick={() => { dispatchAppindex_oszv_tag({ type: "create", recodes: { "PortfolioClientOdinUid": uid }, merge: true }) }}>
                                Ex. регистр «PortfolioClientOdinUid == uid»
                            </button>
                            <button className="btn btn-warning btn-lg m-1"
                                onClick={() => { dispatchAppindex_oszv_tag({ type: "create", recodes: { "PortfolioClientDvaUid": uid }, merge: true }) }}>
                                Ex. регистр «PortfolioClientDvaUid == uid»
                            </button>
                        </div>
                    </div>)
            if (dbAppindex_oszv_tag["portfolioShopUid"] != showUid) { setShowUid(dbAppindex_oszv_tag["portfolioShopUid"]) }
            if (("debug" in Query2Dict()) == false) return (<div></div>)
            return (
                <div className="m-1 p-2" style={{ border: "3px double silver", background: "darkblue", color: "white" }}>
                    <div className="d-flex flex-column text-center">
                        <h3 style={{ color: "red" }}><i className="fas fa-hard-hat mr-1"></i>Сбросить «portfolioShopUid»</h3>
                        <button className="btn btn-warning btn-lg m-1"
                            onClick={() => { dispatchAppindex_oszv_tag({ type: "create", recodes: { "portfolioShopUid": "" }, merge: true }) }}>
                            регистр «PortfolioShopUid == ""»
                        </button>
                    </div>
                </div>)
        }
        return (
            <div className="m-1 p-2" style={{ border: "3px double silver", background: "#001111" }}>
                <div className="d-flex justify-content-center">
                    <h4 style={{ color: "#CCFFFF" }}>かんたんアカウント変更</h4>
                    <i className="fas fa-question-circle fa-2x faa-wrench animated-hover mx-1 fa-btn-help"
                        data-toggle="modal" data-target={"#oszv_switchAuthHelpModal"}></i>
                    {/*roomのヘルプモーダル*/}
                    <div className="modal fade" id={"oszv_switchAuthHelpModal"} role="dialog" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-between">
                                    <h4 className="modal-title">かんたんアカウント変更について</h4>
                                    <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                        <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                    </button>
                                </div>
                                <div className="modal-body d-flex flex-column text-center">
                                    ポートフォリオ評価を簡単にするため作った機能です<br />
                                    ボタン一つでユーザーを変更できます<br />
                                    <p />
                                    <h5>「<b>本来の仕様</b>」と「<b>ポートフォリオ評価用</b>」の違い</h5>
                                    <h6>クエリの「<b>portfolio</b>」を削除すると「本来の仕様」に変更出来ます<br /></h6>
                                    <div className="text-left">
                                        1. 「本来の仕様」では全てのユーザーが出店できますが、「ポートフォリオ評価用」では出店出来ません<br />
                                        2. 「本来の仕様」では様々な店に訪れられますが、「ポートフォリオ評価用」では一つの店に固定されます<br />
                                        3. 「ポートフォリオ評価用」では、簡単のために多数のUIをオミットしております<br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {checkPortfolioShopUid()}
                <div className="d-flex justify-content-between">
                    {dbAppindex_oszv_tag["PortfolioClientOdinUid"] == uid ?
                        <button className="flex-fill btn btn-primary btn-lg m-1" disabled>
                            <i className="far fa-user mr-1" style={{ pointerEvents: "none" }}></i>購買客1(選択中)
                        </button>
                        :
                        <button className="flex-fill btn btn-primary btn-lg btn-push m-1"
                            onClick={() => { easyIn(); }}>
                            <i className="far fa-user mr-1" style={{ pointerEvents: "none" }}></i>購買客1
                        </button>
                    }
                    {dbAppindex_oszv_tag["PortfolioClientDvaUid"] == uid ?
                        <button className="flex-fill btn btn-primary btn-lg m-1" disabled>
                            <i className="far fa-user mr-1" style={{ pointerEvents: "none" }}></i>購買客2(選択中)
                        </button>
                        :
                        <button className="flex-fill btn btn-primary btn-lg btn-push m-1"
                            onClick={() => { easyIn("client@mail.com", "abcdef"); }}>
                            <i className="far fa-user mr-1" style={{ pointerEvents: "none" }}></i>購買客2
                        </button>
                    }
                    {dbAppindex_oszv_tag["portfolioShopUid"] == uid ?
                        <button className="flex-fill btn btn-danger btn-lg m-1" disabled>
                            <i className="far fa-user mr-1" style={{ pointerEvents: "none" }}></i>出品店1(選択中)
                        </button>
                        :
                        <button className="flex-fill btn btn-danger btn-lg btn-push m-1"
                            onClick={() => { easyIn("owner@mail.com", "abcdef"); }}>
                            <i className="far fa-user mr-1" style={{ pointerEvents: "none" }}></i>出品店1
                        </button>
                    }
                </div>
            </div>)
    }
    const dispPosition = () => {
        if (uid == showUid) return (
            <h4 className="text-center" style={{ borderTop: "solid 1px firebrick", borderBottom: "solid 1px firebrick" }}>出品店</h4>)
        if (showUid != uid)
            return (
                <div className="text-center" style={{ borderTop: "solid 1px darkblue", borderBottom: "solid 1px darkblue" }}>
                    <h4>購買客
                        {"portfolio" in Query2Dict() == false ?
                            <button className="btn btn-link btn-lg ml-3" onClick={() => { setShowUid(uid) }}>
                                自分の店舗に行く
                            </button>
                            :
                            <div></div>
                        }
                    </h4>
                </div>
            )
    }
    const dipsShopName = () => {
        if (showUid == "") return (<h2>店がありません</h2>)
        if (dbMypage["shopName"] && uid != showUid)
            return (<h2><i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage["shopName"]}</h2>)
        if (dbMypage["shopName"] && uid == showUid)
            return (
                <div>
                    {tmpSwitch == "shopName" ?
                        <h2 className="form-inline">
                            <input className="form-control form-control-lg m-1" type="text" placeholder="店舗名" value={tmpText} size={32}
                                onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                            <button className="btn btn-success btn-lg m-1" type="button"
                                onClick={() => { updateShop({ "shopName": tmpText }); setTmpText(""); setTmpSwitch(""); }}>
                                <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                                </button>
                            <button className="btn btn-secondary btn-lg m-1" type="button"
                                onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                                </button>
                        </h2>
                        :
                        <h2 className="form-inline">
                            <i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage["shopName"]}
                            <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2 fa-btn"
                                onClick={() => { setTmpText(dbMypage["shopName"]); setTmpSwitch("shopName"); }}></i>
                        </h2>
                    }
                </div>
            )
        if (showUid == uid)
            return (
                <button className="btn btn-link mx-2" onClick={() => { updateShop({}) }}>
                    <h3>店を立てる</h3>
                </button>)
        return (<h2>店が存在しません</h2>)
    }
    const itemColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_s).sort();
        if (tsuids.length == 0) return (<h4 className="text-center">商品がありません</h4>)
        for (var i = 0; i < tsuids.length; i++) {
            tmpRecodes.push(itemModal(tsuids[i], dbOszv_s[tsuids[i]]["name"], dbOszv_s[tsuids[i]]["imageUrl"], dbOszv_s[tsuids[i]]["description"]))
        }
        return (<div className="row">{tmpRecodes}</div>)
    }
    const orderColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_c).sort((a: string, b: string) => {
            return Number(b.split("_")[0]) - Number(a.split("_")[0])
        });
        for (var i = 0; i < tsuids.length; i++) {
            if (uid != showUid && tsuids[i].split("_")[1] != uid) continue
            if (uid == showUid && tsuids[i].split("_")[1] == uid) continue
            tmpRecodes.push(orderModal(tsuids[i], dbOszv_c[tsuids[i]]["name"], dbOszv_c[tsuids[i]]["message"],
                dbOszv_c[tsuids[i]]["imageUrl"], dbOszv_c[tsuids[i]]["status"], dbOszv_c[tsuids[i]]["description"]))
        }
        if (tmpRecodes.length == 0) return (<h4 className="text-center">注文履歴ががありません</h4>)
        return (<div className="row">{tmpRecodes}</div>)
    }
    const appBody = () => {
        console.log("oszv_appBodyReload")
        if (uid == "") return (<div>{needLoginForm()}</div>)
        return (
            <div>
                <div className="row">
                    {/*http://127.0.0.1:5000/app_tsx.html?application=oszv&portfolio*/}
                    {"portfolio" in Query2Dict() == true ? <div className="col-12">{switchAuth()}</div> : <div></div>}
                    <div className="col-sm-12 col-lg-8">{dipsShopName()}</div>
                    <div className="col-sm-12 col-lg-4 text-right">{dispPosition()}</div>
                </div>
                <ul className="nav nav-tabs nav-fill mb-2 mt-2" role="tablist">
                    <li className="nav-item btn-push">
                        <a className="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">
                            <h3>商品一覧</h3>
                        </a>
                    </li>
                    <li className="nav-item btn-push">
                        <a className="nav-link" id="item2-tab" data-toggle="tab" href="#item2" role="tab" aria-controls="item2" aria-selected="false">
                            <h3>注文履歴</h3>
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane fade show active" id="item1" role="tabpanel" aria-labelledby="item1-tab">
                        {addItemButtonZwei()}
                        <div className="mt-2">{itemColumn()}</div>
                    </div>
                    <div className="tab-pane fade" id="item2" role="tabpanel" aria-labelledby="item2-tab">
                        <div className="mt-2">{orderColumn()}</div>
                    </div>
                    <div className="tab-pane fade" id="item3" role="tabpanel" aria-labelledby="item3-tab">This is a text of item#3.</div>
                </div>
            </div>
        )
    }
    return (
        <div className="p-1">
            {showUid != uid ?
                <div>
                    {appBody()}
                </div> :
                <div style={{ backgroundColor: "rgba(240,230,255,0.3)" }}>
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