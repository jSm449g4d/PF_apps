import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb, needLoginForm, easyIn } from "../component/firebaseWrapper";
import { stopf5, Query2Dict, Unixtime2String } from "../component/util_tsx";
import "../stylecheets/style.sass";

export const AppMain = () => {
    const [uid] = useAuth()

    const [showUid, setShowUid] = useState("showuid" in Query2Dict() == false ? uid : Query2Dict()["showuid"])
    const [tmpText, setTmpText] = useState("")
    const [tmpSwitch, setTmpSwitch] = useState("")
    const [orderCnechboxOrdering, setOrderCnechboxOrdering] = useState(true)
    const [orderCnechboxCancel, setOrderCnechboxCancel] = useState(true)
    const [orderCnechboxAccepted, setOrderCnechboxAccepted] = useState(true)
    const [soundVolume, setSoundVolume] = useState(0)
    const [tmpAmount, setTmpAmount] = useState(1)

    const [dbOszv_s, dispatchOszv_s] = useDb()
    const [dbOszv_c, dispatchOszv_c] = useDb()
    const [dbMypage_s, dispatchMypage_s] = useDb() //notTsuidDb
    const [dbMypage_c, dispatchMypage_c] = useDb() //notTsuidDb
    const [dbAppindex_oszv_tag, dispatchAppindex_oszv_tag] = useDb() //notTsuidDb
    const [dbAppindex_oszv_shop, dispatchAppindex_oszv_shop] = useDb() //notTsuidDb
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + showUid }); }, [showUid])
    useEffect(() => { dispatchOszv_c({ type: "setUri", uri: "oszv_c/" + uid }); }, [uid])
    useEffect(() => { dispatchMypage_s({ type: "setUri", uri: "mypage/" + showUid }); }, [showUid])
    useEffect(() => { dispatchMypage_c({ type: "setUri", uri: "mypage/" + uid }); }, [uid])
    useEffect(() => { dispatchAppindex_oszv_tag({ type: "setUri", uri: "appindex/oszv_tag" }); }, [uid])
    useEffect(() => { dispatchAppindex_oszv_shop({ type: "setUri", uri: "appindex/oszv_shop" }); }, [uid])
    useEffect(() => {
        if (soundVolume != 0 && dbMypage_c["announce"] == "called") new Audio("/static/audio/called.mp3").play()
        if (soundVolume != 0 && dbMypage_c["announce"] == "gotOrder") new Audio("/static/audio/gotOrder.mp3").play()
        if (soundVolume != 0 && dbMypage_c["announce"] == "nurseCall") new Audio("/static/audio/nurseCall.mp3").play()
        if (soundVolume != 0 && dbMypage_c["announce"] != "") {
            setTimeout(() => dispatchMypage_c({ type: "create", recodes: { "announce": "" }, merge: true }), 1000)
        }
    }, [dbMypage_c["announce"]])


    const updateShop = (addDict: any) => {
        if (showUid != uid) return false;
        dispatchMypage_s({ type: "create", recodes: Object.assign({ "shopName": "新しい店" }, addDict), merge: true })
        dispatchAppindex_oszv_shop({
            type: "create", recodes: {
                [uid]: Object.assign({ "shopName": "新しい店", "iconUrl": "" }, addDict),
            }, merge: true
        });
    }
    const updateItem = (tsuid: string, addDict: any) => {
        if (showUid != uid) return false;
        dispatchOszv_s({ type: "create", recodes: { [tsuid]: Object.assign(Object.assign({}, dbOszv_s[tsuid]), addDict) }, merge: true })
    }
    const dbOperate = (sendCreate: any = {}) => {
        // access to backend
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("POST", "/Flask/oszv/main.py", true);
        xhr.ontimeout = () => console.error("The request timed out.");
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) console.log(xhr.responseText);
        };
        xhr.timeout = 10000;
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
                <h4 className="d-flex flex-column text-center img-thumbnail" style={{ height: _height, objectFit: "contain" }} >
                    <i className="fab fa-themeisle fa-2x m-2"></i>No Image
                </h4>)
        return (<div className="d-flex flex-column text-center img-thumbnail"><img className="img-fluid" src={imageUrl} alt={imageUrl}
            style={{ height: _height, objectFit: "contain" }} /></div>)
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
            <div className="my-1">
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
                    <div className="row p-1 px-3">
                        {/*アップロード*/}
                        <button className="col-6 p-1 flex-fill btn btn-warning btn-lg" type="button"
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
                        <button className="col-6 p-1 flex-fill btn btn-outline-danger btn-lg" type="button"
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
        const _r = () => {
            return (
                <div className="modal fade" id={"oszv_itemClientModal_N"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h3 className="modal-title">
                                    新商品の追加
                                </h3>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex flex-column text-center">
                                    <input className="form-control form-control-lg m-1" type="text" placeholder="商品名" value={tmpText} size={32}
                                        onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                                </div>
                                <div className="d-flex flex-column text-center">
                                    {tmpText == "" ? <div></div> :
                                        <button className="btn btn-success btn-lg btn-push my-1" type="button" data-dismiss="modal"
                                            onClick={() => {
                                                const _tsuid = Date.now().toString() + "_" + uid
                                                updateItem(_tsuid, { "name": tmpText, "imageUrl": "", "description": "詳細はありません" });
                                                setTmpText(""); setTmpSwitch("");
                                            }}>
                                            追加する
                                    </button>
                                    }
                                    <button className="btn btn-danger btn-lg btn-push my-1" type="button" data-dismiss="modal"
                                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                        <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>中止
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
        }
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-md-7 col-lg-9 d-flex flex-column">
                        <button className="btn btn-primary btn-lg rounded-pill btn-push m-1" data-toggle="modal" data-target={"#V" + "_addItemModal"}
                            onClick={() => {
                                setTmpText(""); setTmpSwitch("newName")
                                $("#oszv_itemClientModal_N").modal()
                            }}>
                            <b>+商品を追加</b>
                        </button>
                    </div>
                    <div className="col-sm-12 col-md-5 col-lg-3 d-flex flex-column">
                        <button className="btn btn-secondary btn-lg rounded-pill btn-push m-1" type="button"
                            onClick={() => { updateImageAll(); }}>
                            <i className="fas fa-redo mr-1" style={{ pointerEvents: "none" }}></i>画像を更新
                        </button>
                    </div>
                </div>
                {_r()}
            </div>

        )
    }
    const addOrder = (itemTsuid: string = "nullPoi", name: string = "新しい注文", amount: string = "1", message: string = "無し", imageUrl: string = "", description: string = "") => {
        if (showUid == uid) return false;
        const tsuid: string = Date.now().toString() + "_" + uid
        dbOperate({
            type: "create",
            uri: "oszv_c/" + tsuid.split("_")[1],
            recodes: {
                [tsuid]: {
                    "itemTsuid": itemTsuid,
                    "name": name,
                    "amount": amount,
                    "message": message,
                    "imageUrl": imageUrl,
                    "status": "ordering",
                    "description": description,
                    "clientName": dbMypage_c["nickname"],
                    "shopName": dbMypage_s["shopName"],
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
                    "amount": amount,
                    "message": message,
                    "imageUrl": imageUrl,
                    "status": "ordering",
                    "description": description,
                    "clientName": dbMypage_c["nickname"],
                    "shopName": dbMypage_s["shopName"],
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
    const itemClientModal = (tsuid: string, itemName: string, imageUrl: string = "", itemDescription: string = "") => {
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 p-1">
                {/*将棋盤のボタン(#A)*/}
                <div className="btn-col" style={{ background: "rgba(255,255,255,0.9)" }}>
                    <a className="a-nolink" data-toggle="modal" id={"oszv_itemClientModal_A" + tsuid} data-target={"#oszv_itemClientModal_V" + tsuid}
                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                        {showImage(imageUrl)}
                        <h5 className="d-flex flex-column text-center mt-1">{itemName}</h5>
                    </a>
                </div>
                {/*注文モーダル*/}
                <div className="modal fade" id={"oszv_itemClientModal_V" + tsuid} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h3 className="modal-title">
                                    <i className="fas fa-utensils mr-1" style={{ pointerEvents: "none" }}></i>{itemName}
                                </h3>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {showImage(imageUrl, "300px")}
                                <div className="m-1 d-flex flex-column text-center" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                                    <h4>商品詳細</h4>
                                    {itemDescription}
                                </div>
                                <div className="m-1 d-flex justify-content-between" style={{ backgroundColor: "lightcyan", border: "3px double silver" }}>
                                    <button className="btn btn-danger btn-push" type="button"
                                        onClick={(evt) => { if (1 < tmpAmount) setTmpAmount(tmpAmount - 1) }}>-減少</button>
                                    <h4>個数：{tmpAmount}</h4>
                                    <button className="btn btn-primary btn-push" type="button"
                                        onClick={(evt) => { if (10 > tmpAmount) setTmpAmount(tmpAmount + 1) }}>+追加</button>
                                </div>
                                <div className="d-flex flex-column text-center">
                                    <button className="btn btn-success btn-lg btn-push m-1" type="button" data-dismiss="modal"
                                        onClick={(evt) => {
                                            addOrder(tsuid, itemName, String(tmpAmount), "メッセージはありません", imageUrl, itemDescription);
                                            $("#oszv_itemClientModal_C" + tsuid).modal();
                                            dbOperate({ type: "gotOrder", uri: "mypage/" + showUid, recodes: {} })
                                            setTmpAmount(1)
                                        }}>
                                        <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>注文
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*注文確認*/}
                <div className="modal fade" id={"oszv_itemClientModal_C" + tsuid} role="dialog" aria-hidden="true">
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
    const itemOwnerModal = (tsuid: string, itemName: string, imageUrl: string = "", itemDescription: string = "") => {
        const showDescription = (_itemDescription: string = "") => {
            if (tmpSwitch == "itemDescription") return (
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
            return (
                <div className="m-1 d-flex flex-column text-center" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                    <h4>商品詳細
                        <i className="fas fa-pencil-alt ml-2 fa-btn"
                            onClick={() => { setTmpText(_itemDescription); setTmpSwitch("itemDescription"); }}></i>
                    </h4>
                    {_itemDescription}
                </div>)
        }
        const submitButton = () => {
            if (itemName == "新しい商品") return (
                <button className="btn btn-success btn-lg my-1" type="button" disabled>
                    ×商品名を入力してください
                </button>)
            return (
                <div className="d-flex flex-column text-center my-1">
                    {uploadImage(tsuid, imageUrl)}
                    <button className="btn btn-success btn-lg btn-push" type="button" data-dismiss="modal"
                        onClick={(evt) => { updateImage(tsuid) }}>
                        <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>編集完了
                </button>
                </div>)
        }
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 p-1">
                {/*将棋盤のボタン(#A)*/}
                <div className="btn-col" style={{ background: "rgba(255,255,255,0.9)" }}>
                    <a className="a-nolink" data-toggle="modal" id={"oszv_itemClientModal_A" + tsuid} data-target={"#oszv_itemClientModal_V" + tsuid}
                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                        {showImage(imageUrl)}
                        <h5 className="d-flex flex-column text-center mt-1">{itemName}</h5>
                    </a>
                </div>
                {/*注文モーダル(#V)*/}
                <div className="modal fade" id={"oszv_itemClientModal_V" + tsuid} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h3 className="modal-title">
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
                                            <i className="fas fa-pencil-alt ml-2 fa-btn"
                                                onClick={() => { setTmpText(itemName); setTmpSwitch("itemName"); }}></i>
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
                                <div className="d-flex flex-column text-center">
                                    {submitButton()}
                                    <button className="btn btn-danger btn-lg my-1" type="button" data-dismiss="modal"
                                        onClick={(evt) => {
                                            dispatchOszv_s({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true });
                                            dispatchOszv_s({ type: "strageDelete", fileName: tsuid + ".img" })
                                        }}>
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
    const shopModal = (_uid: string, shopName: string, iconUrl: string = "",) => {
        if (uid == _uid)
            return (
                <div className="col-sm-6 col-md-4 col-lg-3 p-1">
                    <div className="btn-col" style={{ background: "rgba(240,220,240,0.9)" }}>
                        <a className="a-nolink" onClick={() => { setShowUid(_uid); }}>
                            {showImage(iconUrl)}
                            <h5 className="text-center mt-1">{shopName}<b style={{ color: "darkred" }}>(自店)</b></h5>
                        </a>
                    </div>
                </div>)
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 p-1">
                <div className="btn-col" style={{ background: "rgba(255,255,255,0.9)" }}>
                    <a className="a-nolink" onClick={() => { setShowUid(_uid); }}>
                        {showImage(iconUrl)}
                        <h5 className=" text-center mt-1">{shopName}</h5>
                    </a>
                </div>
            </div>)
    }
    const orderModal = (tsuid: string, orderName: string, orderAmount: string = "1", orderMessage: string = "", orderImage: string = "",
        orderStatus: string = "", orderDescription: string = "", clientorShopName: string = "") => {
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
                <button className="btn btn-danger btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "accepted" && uid != showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-2" type="button" data-dismiss="modal"
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
                <button className="btn btn-warning btn-lg my-1" type="button" data-dismiss="modal"
                    onClick={() => {
                        if (soundVolume != 0) new Audio("/static/audio/calling.mp3").play()
                        dbOperate({
                            type: "called",
                            uri: "mypage/" + tsuid.split("_")[1],
                            recodes: {}
                        })
                    }}>
                    <i className="fas fa-bell mr-1" style={{ pointerEvents: "none" }}></i>呼び出し
                </button>
                <button className="btn btn-warning btn-lg my-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceled" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>取引キャンセル
                </button>
                <button className="btn btn-danger btn-lg m-2" type="button" data-dismiss="modal"
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
                <button className="btn btn-warning btn-lg my-1" type="button" data-dismiss="modal"
                    onClick={() => {
                        if (soundVolume != 0) new Audio("/static/audio/calling.mp3").play()
                        dbOperate({
                            type: "called",
                            uri: "mypage/" + tsuid.split("_")[1],
                            recodes: {}
                        })
                    }}>
                    <i className="fas fa-bell mr-1" style={{ pointerEvents: "none" }}></i>呼び出し
                </button>
                <button className="btn btn-warning btn-lg my-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceled" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>取引キャンセル
                </button>
            </div>)
        if (orderStatus == "canceled" && uid == showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "accepted" && uid == showUid) tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-warning btn-lg my-1" type="button" data-dismiss="modal"
                    onClick={() => {
                        if (soundVolume != 0) new Audio("/static/audio/calling.mp3").play()
                        dbOperate({
                            type: "called",
                            uri: "mypage/" + tsuid.split("_")[1],
                            recodes: {}
                        })
                    }}>
                    <i className="fas fa-bell mr-1" style={{ pointerEvents: "none" }}></i>呼び出し
                </button>
                <button className="btn btn-danger btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)

        return (
            <div className="col-12 p-1">
                <div className="btn-col">
                    <a className="row a-nolink" data-toggle="modal" data-target={"#V" + tsuid + "_orderModal"}>
                        <div className="col-sm-5 col-lg-3">
                            {orderStatus == "ordering" ? <h3 style={{ color: "darkcyan" }}>取引中</h3> : <div></div>}
                            {orderStatus == "canceling" ? <h3 style={{ color: "chocolate" }}>キャンセル申請中</h3> : <div></div>}
                            {orderStatus == "canceled" ? <h3 style={{ color: "darkred" }}>キャンセル済</h3> : <div></div>}
                            {orderStatus == "accepted" ? <h3 style={{ color: "darkblue" }}>取引済</h3> : <div></div>}
                        </div>
                        <h4 className="col-sm-6 col-lg-6">
                            {orderAmount == "1" ? <div>{orderName}</div> : <div>{orderName}{orderAmount}[個]</div>}
                        </h4>
                        <h5 className="col-sm-6 col-lg-3 tent-center">
                            {clientorShopName}
                        </h5>
                        <h5 className="col-sm-4 col-lg-12 tent-center">
                            {Unixtime2String(Number(tsuid.split("_")[0]))}
                        </h5>
                        <h6 className="col-sm-12 col-lg-12">メッセージ: {orderMessage}</h6>
                    </a>
                </div>
                <div className="modal fade" id={"V" + tsuid + "_orderModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header justify-content-between">
                                <h4 className="modal-title">
                                    {orderAmount == "1" ? <div>{orderName}</div> : <div>{orderName}{orderAmount}[個]</div>}
                                </h4>
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
                                                <i className="fas fa-pencil-alt ml-2 fa-btn"
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
            <div className="m-1 p-2 slidein-1-reverse" style={{ border: "3px double silver", background: "#001111" }}>
                <div className="d-flex flex-column text-center">
                    <h3 style={{ color: "#AAFFAA" }}>チュートリアルへようこそ
                        <i className="fas fa-question-circle ml-1 fa-btn-help"
                            data-toggle="modal" data-target={"#oszv_switchAuthHelpModal"}></i>
                    </h3>
                    <h4 style={{ color: "#DDFFFF" }}>かんたんアカウント変更
                    </h4>
                    {/*roomのヘルプモーダル*/}
                    <div className="modal fade" id={"oszv_switchAuthHelpModal"} role="dialog" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-between">
                                    <h4 className="modal-title">チュートリアルについて</h4>
                                    <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                        <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                    </button>
                                </div>
                                <div className="modal-body d-flex flex-column text-center">
                                    <h5>「<b>チュートリアル</b>」は機能が限定されています</h5>
                                    <h6>クエリの「<b>portfolio</b>」を削除すると「本来の仕様」に変更出来ます。<br /></h6>
                                    <div className="text-left">
                                    </div>
                                    <button className="btn btn-link btn-lg btn-push"
                                        data-toggle="collapse"
                                        data-target="#oszv_switchAuthHelpCollapse"
                                        aria-expand="false">
                                        詳細
                                    </button>
                                    <div className="collapse" id="oszv_switchAuthHelpCollapse">
                                        <div className="card card-body text-left">
                                            1. 「チュートリアル」では、自動的に「簡単ログイン用ユーザー」としてログインされます。<br />
                                            2. 「チュートリアル」では、一部UIや機能が省略されています。<br />
                                        </div>
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
        if (showUid == "") return (
            <h4 className="text-center">
                <i className="far fa-user mr-1"></i>{dbMypage_c["nickname"] ? dbMypage_c["nickname"] : "名無しの店主さん"}
            </h4>)
        if (showUid == uid) return (
            <h4 className="text-center">
                <i className="far fa-user mr-1"></i>{dbMypage_c["nickname"] ? dbMypage_c["nickname"] : "名無しの店主さん"}
                <b style={{ color: "darkred" }}>(店主)</b>
            </h4>)
        if (showUid != uid)
            return (
                <h4 className="text-center">
                    <i className="far fa-user mr-1"></i>{dbMypage_c["nickname"] ? dbMypage_c["nickname"] : "名無しのお客さん"}
                    <b style={{ color: "darkblue" }}>(購買客)</b>
                </h4>
            )
    }
    const dispBreadcrumbs = () => {
        const _breadcrumbs = []
        if (showUid == "") {
            _breadcrumbs.push(<div>店の選択</div>)
            _breadcrumbs.push(<div> : </div>)
            _breadcrumbs.push(<h4 className="btn-link btn-push" onClick={() => { setShowUid(uid) }}>自分の店舗へ</h4>)
            return (<div className="form-inline">{_breadcrumbs}</div>)
        }
        _breadcrumbs.push(<h4 className="btn-link btn-push" onClick={() => { setShowUid("") }}>店の選択</h4>)
        if (showUid != uid) {
            _breadcrumbs.push(<div> → </div>)
            _breadcrumbs.push(<div>{dbMypage_s["shopName"]}</div>)
        }
        if (showUid == uid) {
            _breadcrumbs.push(<div> → </div>)
            _breadcrumbs.push(<div>自分の店舗</div>)
        }
        return (<div className="form-inline">{_breadcrumbs}</div>)
    }
    const dipsShopName = () => {
        if (showUid == "") return (<h3><i className="fas fa-walking mr-1"></i>訪れる店を選択</h3>)
        if (dbMypage_s["shopName"] && uid != showUid)
            return (
                <div className="form-inline">
                    <h2 style={{ fontFamily: "MS Gothic" }}>
                        <i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage_s["shopName"]}
                    </h2>
                </div>)
        if (dbMypage_s["shopName"] && uid == showUid)
            return (
                <div>
                    {tmpSwitch == "shopName" ?
                        <h2 className="form-inline">
                            <input className="form-control form-control-lg m-1" type="text" placeholder="店舗名" value={tmpText} size={32}
                                onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                            <button className="btn btn-success btn-lg btn-push m-1" type="button"
                                onClick={() => {
                                    updateShop({ "shopName": tmpText, "iconUrl": dbMypage_s["iconUrl"] });
                                    setTmpText(""); setTmpSwitch("");
                                }}>
                                <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                            </button>
                            <button className="btn btn-link btn-lg btn-push m-1" type="button"
                                onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                                </button>
                        </h2>
                        :
                        <h2 className="form-inline" style={{ fontFamily: "MS Gothic" }}>
                            <i className="fas fa-store mr-1" style={{ pointerEvents: "none" }}></i>{dbMypage_s["shopName"]}
                            <i className="fas fa-pencil-alt ml-2 fa-btn"
                                onClick={() => { setTmpText(dbMypage_s["shopName"]); setTmpSwitch("shopName"); }}></i>
                        </h2>
                    }
                </div>
            )
        if (showUid == uid)
            return (
                <button className="btn btn-success btn-push" onClick={() => { updateShop({ "iconUrl": dbMypage_s["iconUrl"] }) }}>
                    <h3>店を立てる</h3>
                </button>)
        //if ("portfolio" in Query2Dict() == false) { setShowUid("") }
        return (<h2>店が存在しません</h2>)
    }
    const itemColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_s).sort();
        if (tsuids.length == 0) return (<h4 className="text-center">商品がありません</h4>)
        if (uid == showUid) for (var i = 0; i < tsuids.length; i++) {
            tmpRecodes.push(itemOwnerModal(tsuids[i], dbOszv_s[tsuids[i]]["name"], dbOszv_s[tsuids[i]]["imageUrl"], dbOszv_s[tsuids[i]]["description"]))
        }
        if (uid != showUid) for (var i = 0; i < tsuids.length; i++) {
            tmpRecodes.push(itemClientModal(tsuids[i], dbOszv_s[tsuids[i]]["name"], dbOszv_s[tsuids[i]]["imageUrl"], dbOszv_s[tsuids[i]]["description"]))
        }
        return (<div className="p-3"><div className="row">{tmpRecodes}</div></div>)
    }
    const orderColumn = () => {
        const tmpRecodes = [];
        tmpRecodes.push(
            <div className="col-12 p-1">
                <div className="d-flex justify-content-between text-center">
                    <h4>取引状況フィルタ</h4>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="oszv_check1a"
                            defaultChecked={true} checked={orderCnechboxOrdering}
                            onChange={evt => setOrderCnechboxOrdering(!orderCnechboxOrdering)} />
                        <label style={{ color: "darkcyan" }} htmlFor="oszv_check1a"><h5>取引中</h5></label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="oszv_check1b"
                            defaultChecked={true} checked={orderCnechboxCancel}
                            onChange={evt => setOrderCnechboxCancel(!orderCnechboxCancel)} />
                        <label style={{ color: "darkred" }} htmlFor="oszv_check1b"><h5>キャンセル</h5></label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="oszv_check1c"
                            defaultChecked={true} checked={orderCnechboxAccepted}
                            onChange={evt => setOrderCnechboxAccepted(!orderCnechboxAccepted)} />
                        <label style={{ color: "darkblue" }} htmlFor="oszv_check1c"><h5>取引後</h5></label>
                    </div>
                </div>
            </div>)
        const tsuids = Object.keys(dbOszv_c).sort((a: string, b: string) => {
            return Number(b.split("_")[0]) - Number(a.split("_")[0])
        });
        for (var i = 0; i < tsuids.length; i++) {
            if (uid != showUid && tsuids[i].split("_")[1] != uid) continue
            if (uid == showUid && tsuids[i].split("_")[1] == uid) continue
            //alert(dbOszv_c[tsuids[i]]["status"])
            if (orderCnechboxOrdering == false && "ordering" == String(dbOszv_c[tsuids[i]]["status"])) continue
            if (orderCnechboxCancel == false && String(dbOszv_c[tsuids[i]]["status"]).match("cancel")) continue
            if (orderCnechboxAccepted == false && "accepted" == String(dbOszv_c[tsuids[i]]["status"])) continue
            let clientOrShopName = "販売店: " + dbOszv_c[tsuids[i]]["shopName"]
            if (uid == showUid) clientOrShopName = "購入者: " + dbOszv_c[tsuids[i]]["clientName"]
            tmpRecodes.push(orderModal(tsuids[i], dbOszv_c[tsuids[i]]["name"], dbOszv_c[tsuids[i]]["amount"], dbOszv_c[tsuids[i]]["message"],
                dbOszv_c[tsuids[i]]["imageUrl"], dbOszv_c[tsuids[i]]["status"], dbOszv_c[tsuids[i]]["description"],
                clientOrShopName))
        }
        if (tmpRecodes.length == 0) return (<h4 className="text-center">注文履歴ががありません</h4>)
        return (<div className="row p-1 px-3">{tmpRecodes}</div>)
    }
    const shopColumn = () => {
        const tmpRecodes = [];
        const _uids = Object.keys(dbAppindex_oszv_shop).sort();
        if (_uids.length == 0) return (<h4 className="text-center">誰も出店していません</h4>)
        for (var i = 0; i < _uids.length; i++) {
            tmpRecodes.push(shopModal(_uids[i], dbAppindex_oszv_shop[_uids[i]]["shopName"], dbAppindex_oszv_shop[_uids[i]]["iconUrl"]))
        }
        return (<div className="p-3"><div className="row">{tmpRecodes}</div></div>)
    }
    const nurseCallModal = () => {
        if (showUid == "" || uid == showUid) return (<div></div>)
        return (
            <div className="d-flex flex-column">
                {/*将棋盤のボタン(#A)*/}
                <button className="btn btn-warning rounded-pill btn-lg btn-push"
                    data-toggle="modal" data-target={"#oszv_nurseCallConfirm"}>
                    <i className="fas fa-bell mr-1" style={{ pointerEvents: "none" }}></i>呼び出し
                </button>
                <div className="modal fade" id={"oszv_nurseCallConfirm"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h3 className="modal-title">呼び出し確認</h3>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex flex-column text-center">
                                    <button className="btn btn-success btn-lg m-1" type="button" data-dismiss="modal"
                                        onClick={(evt) => {
                                            $("#oszv_nurseCallConfirm_C").modal()
                                            dbOperate({ type: "nurseCall", uri: "mypage/" + showUid, recodes: {} })
                                        }}>
                                        <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>呼び出す
                                    </button>
                                    <button className="btn btn-outline-secondary btn-lg m-1" type="button" data-dismiss="modal">
                                        中止
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*注文確認(#C)*/}
                <div className="modal fade" id={"oszv_nurseCallConfirm_C"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h4 className="modal-title">呼び出し確認</h4>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body d-flex flex-column text-center">
                                <h5>呼び出しました</h5>
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
    const announceSound = () => {
        if (soundVolume == 0) return (
            <button className="btn btn-outline-dark btn-lg btn-push" type="button"
                onClick={() => { setSoundVolume(100) }}>
                <i className="fas fa-volume-mute mr-1" style={{ pointerEvents: "none" }}></i>音OFF
            </button>)
        return (
            <button className="btn btn-light btn-lg btn-push" type="button"
                onClick={() => { setSoundVolume(0) }}>
                <i className="fas fa-volume-up mr-1" style={{ pointerEvents: "none" }}></i>音ON
            </button>)
    }
    const appBody = () => {
        console.log("oszv_appBodyReload")
        if (uid == "") return (<div>{needLoginForm()}</div>)
        return (
            <div>
                <div className="p-1 px-3"><div className="row">
                    {/*http://127.0.0.1:5000/app_tsx.html?application=oszv&portfolio*/}
                    {"portfolio" in Query2Dict() == true ? <div className="col-12">{switchAuth()}</div> : <div></div>}
                    <div className="col-sm-12 col-lg-4 slidein-1-reverse p-1">
                        <div className="d-flex justify-content-center justify-content-lg-start">
                            {dispBreadcrumbs()}
                        </div>
                    </div>
                    <div className="col-sm-12 col-lg-4 slidein-1-reverse p-1">
                        <div className="d-flex justify-content-center flex-lg-fill">
                            {dispPosition()}
                        </div>
                    </div>
                    <div className="col-sm-12 col-lg-4 text-right slidein-1 p-1">
                        <div className="d-flex justify-content-center justify-content-lg-end">
                            {dipsShopName()}
                        </div>
                    </div>
                    <div className="col-12 text-right slidein-1 p-1">
                        <div className="row p-1 px-3">
                            <div className="col-3 p-1 d-flex flex-column"></div>
                            <div className="col-6 p-1 d-flex flex-column">{nurseCallModal()}</div>
                            <div className="col-3 p-1 d-flex flex-column">{announceSound()}</div>
                        </div>
                    </div>
                </div></div>
                <ul className="nav nav-tabs nav-fill mb-2 mt-2" role="tablist">
                    <li className="nav-item btn-push">
                        <a className="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">
                            {showUid == "" ? <h3>店舗一覧</h3> : <h3>商品一覧</h3>}
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
                        {showUid == "" ? <div className="mt-2">{shopColumn()}</div> : <div className="mt-2">{addItemButtonZwei()}{itemColumn()}</div>}
                    </div>
                    <div className="tab-pane fade" id="item2" role="tabpanel" aria-labelledby="item2-tab">
                        <div className="mt-2">{orderColumn()}</div>
                    </div>
                    <div className="tab-pane fade" id="item3" role="tabpanel" aria-labelledby="item3-tab">This is a text of item#3.</div>
                </div>
            </div >
        )
    }
    const backImageRender = () => {
        if (showUid == "") return (<div style={{ backgroundColor: "rgba(220,240,220,0.3)" }}>{appBody()}</div>)
        if (showUid == uid) return (<div style={{ backgroundColor: "rgba(240,220,240,0.3)" }}>{appBody()}</div>)
        if (showUid != uid) return (<div>{appBody()}</div>)
    }
    return (<div>{backImageRender()}</div>)
};

//titleLogo
export const titleLogo = () => {
    return (<div style={{ fontFamily: "Impact", color: "black" }}>受付注文システム</div>)
    {/*正式名称 */ }
    //return (<div style={{ fontFamily: "Century", color: "black" }}>общая система заказа и вызова</div>)
}