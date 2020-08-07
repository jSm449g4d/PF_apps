import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb, needLoginForm } from "../component/firebaseWrapper";
import { stopf5, Query2Dict, Unixtime2String } from "../component/util_tsx";
import "../stylecheets/style.sass";

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
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + showUid }); setPosition("client") }, [showUid])
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + showUid }); }, [showUid])
    useEffect(() => {
        if (position == "client") dispatchOszv_c({ type: "setUri", uri: "oszv_cc/" + uid });
        if (position == "owner") dispatchOszv_c({ type: "setUri", uri: "oszv_cs/" + uid });
    }, [uid, position])

    const updateShop = (addDict: any) => {
        if (showUid != uid || position != "owner") return false;
        dispatchMypage({ type: "create", recodes: Object.assign({ "shopName": "新しい店" }, addDict), merge: true })
    }
    const updateItem = (tsuid: string, addDict: any) => {
        if (showUid != uid || position != "owner") return false;
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
        if (showUid != uid) return false;
        // [tsuid(client)]: itemTsuid(Owner),
        const itemTsuid: string = dbOszv_c[tsuid]["itemTsuid"]
        dbOperate({
            type: "create",
            uri: "oszv_cc/" + tsuid.split("_")[1],
            recodes: { [tsuid]: Object.assign(Object.assign({}, dbOszv_c[tsuid]), addDict) }
        })
        dbOperate({
            type: "create",
            uri: "oszv_cs/" + itemTsuid.split("_")[1],
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
    const updateImage = () => {
        if (showUid != uid || position != "owner") return;
        const tsuids = Object.keys(dbOszv_s).sort();
        for (let i = 0; i < tsuids.length; i++) {
            dispatchOszv_s({
                type: "download", fileName: tsuids[i] + ".img",
                func: (_url: any) => {
                    if (_url != dbOszv_s["imageUrl"]) updateItem(tsuids[i], { "imageUrl": _url })
                }
            })
        }
    }
    const uploadImage = (tsuid: string, imageUrl = "") => {
        if (showUid != uid || position != "owner") return (<div></div>);
        return (
            <div className="m-1">
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
                                setTimeout(() => { updateImage() }, 2000)
                            }} />
                    </div>
                    :
                    <div className="row">
                        {/*アップロード*/}
                        <button className="col-6 btn btn-warning btn-lg" type="button"
                            onClick={(evt) => { $(document.getElementById("Uc" + tsuid + "_uploadImage")).click() }
                            }>
                            <i className="fas fa-upload mr-1" style={{ pointerEvents: "none" }}></i>画像を投稿
                        </button>
                        <input type="file" className="d-none" accept="image/jpeg,image/png" id={"Uc" + tsuid + "_uploadImage"} name={tsuid}
                            onChange={(evt) => {
                                dispatchOszv_s({ type: "upload", file: evt.target.files[0], fileName: evt.target.name + ".img" })
                                setTimeout(() => { updateImage() }, 2000)
                            }} />
                        <div className="col-1"></div>
                        <button className="col-5 btn btn-outline-danger btn-lg" type="button"
                            onClick={(evt) => {
                                dispatchOszv_s({ type: "strageDelete", fileName: tsuid + ".img" })
                                setTimeout(() => { updateImage() }, 2000)
                            }}>
                            <i className="fas fa-eraser mr-1" style={{ pointerEvents: "none" }}></i>画像を削除
                    </button>
                    </div>
                }
            </div>
        )
    }
    const addItemButtonZwei = () => {
        if (showUid != uid || position != "owner") return (<div></div>);
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-lg-8 d-flex flex-column">
                        <button className="btn btn-primary btn-lg rounded-pill m-1" data-toggle="modal" data-target={"#V" + "_addItemModal"}
                            onClick={() => {
                                setTmpText("新しい商品"); setTmpSwitch("itemName");
                                const _tsuid = Date.now().toString() + "_" + uid
                                updateItem(_tsuid, { "name": "新しい商品", "imageUrl": "" })
                                setTimeout(() => document.getElementById("A" + _tsuid + "_itemModal").click(), 800)
                            }}>
                            <b>+商品を追加</b>
                        </button>
                    </div>
                    <div className="col-sm-12 col-lg-4 d-flex flex-column">
                        <button className="btn btn-secondary btn-lg rounded-pill m-1" type="button"
                            onClick={() => { updateImage(); }}>
                            <i className="fas fa-redo mr-1" style={{ pointerEvents: "none" }}></i>画像を更新する
                    </button>
                    </div>
                </div>
            </div>
        )
    }
    const addOrder = (itemTsuid: string = "nullPoi", name: string = "新しい注文", message: string = "無し", imageUrl: string = "") => {
        if (showUid != uid || position != "client") return false;
        const tsuid: string = Date.now().toString() + "_" + uid
        dbOperate({
            type: "create",
            uri: "oszv_cc/" + itemTsuid.split("_")[1],
            recodes: {
                [tsuid]: {
                    "itemTsuid": itemTsuid,
                    "name": name,
                    "message": message,
                    "imageUrl": imageUrl,
                    "status": "ordering"
                }
            }
        })
        dbOperate({
            type: "create",
            uri: "oszv_cs/" + showUid,
            recodes: {
                [tsuid]: {
                    "itemTsuid": itemTsuid,
                    "name": name,
                    "message": message,
                    "imageUrl": imageUrl,
                    "status": "ordering"
                }
            }
        })
    }
    const deleteOrder = (tsuid: string) => {
        // [tsuid(client)]: itemTsuid(Owner),
        const itemTsuid: string = dbOszv_c[tsuid]["itemTsuid"]
        dbOperate({
            type: "delete",
            uri: "oszv_cc/" + tsuid.split("_")[1],
            recodes: { [tsuid]: "dbFieldDelete" }
        })
        dbOperate({
            type: "delete",
            uri: "oszv_cs/" + itemTsuid.split("_")[1],
            recodes: { [tsuid]: "dbFieldDelete" }
        })
    }
    const itemModal = (tsuid: string, itemName: string, imageUrl: string = "") => {
        return (
            <div className="col-sm-6 col-md-4 col-lg-2 oszv-column">
                {/*将棋盤のボタン(#A)*/}
                <a data-toggle="modal" id={"A" + tsuid + "_itemModal"} data-target={"#V" + tsuid + "_itemModal"}
                    onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                    {showImage(imageUrl)}
                    <h5 className="d-flex flex-column text-center mt-1">{itemName}</h5>
                </a>
                {/*注文モーダル(#V)*/}
                <div className="modal fade" id={"V" + tsuid + "_itemModal"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h3 className="modal-title">
                                    {position == "client" ?
                                        <div><i className="fas fa-utensils mr-1" style={{ pointerEvents: "none" }}></i>{itemName}</div>
                                        :
                                        <div>
                                            {tmpSwitch == "itemName" ?
                                                <div className="text-center m-1">
                                                    <input className="form-control form-control-lg m-1" type="text" placeholder="商品名" value={tmpText}
                                                        onChange={(evt: any) => { setTmpText(evt.target.value) }} />
                                                    <button className="btn btn-success btn-lg m-1" type="button"
                                                        onClick={() => { updateItem(tsuid, { "name": tmpText }); setTmpText(""); setTmpSwitch(""); }}>
                                                        <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                                                    </button>
                                                    <button className="btn btn-secondary btn-lg m-1" type="button"
                                                        onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                                        <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
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
                                </h3>
                                <button className="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                                    <i className="fas fa-times" style={{ pointerEvents: "none" }}></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {showImage(imageUrl, "300px")}
                                <p />
                                {position == "client" ?
                                    <div className="d-flex flex-column text-center">
                                        <button className="btn btn-success btn-lg m-1" type="button" data-dismiss="modal"
                                            onClick={(evt) => {
                                                addOrder(tsuid, itemName, "無し", imageUrl);
                                                $(document.getElementById("Cc" + tsuid + "_itemModal")).click();
                                            }}>
                                            <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>注文
                                        </button>
                                        <button type="button" id={"Cc" + tsuid + "_itemModal"} className="d-none" data-toggle="modal" data-target={"#C" + tsuid + "_itemModal"} />
                                    </div>
                                    :
                                    <div className="d-flex flex-column text-center">
                                        {uploadImage(tsuid, imageUrl)}
                                        <button className="btn btn-success btn-lg m-2" type="button" data-dismiss="modal" >
                                            <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>編集完了
                                        </button>
                                        <button className="btn btn-danger btn-lg m-3" type="button" data-dismiss="modal"
                                            onClick={(evt) => { dispatchOszv_s({ type: "create", recodes: { [tsuid]: dbFieldDelete }, merge: true }); }}>
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
    const orderModal = (tsuid: string, orderName: string, orderMessage: string, orderImage: string = "", orderStatus: string = "") => {
        const tailConsoleButtons = []
        if (orderStatus == "ordering" && position == "client") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-warning btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceling" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>キャンセル申請
                </button>
            </div>)
        if (orderStatus == "canceling" && position == "client") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-warning btn-lg m-2" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "ordering" }); }}>
                    <i className="fas fa-recycle mr-1" style={{ pointerEvents: "none" }}></i>キャンセル中止
                </button>
            </div>)
        if (orderStatus == "canceled" && position == "client") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "accepted" && position == "client") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "ordering" && position == "owner") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center m-2">
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
        if (orderStatus == "canceling" && position == "owner") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center m-2">
                <button className="btn btn-primary btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "accepted" }); }}>
                    <i className="fas fa-check mr-1" style={{ pointerEvents: "none" }}></i>取引を承認
                </button>
                <button className="btn btn-warning btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { updateOrder(tsuid, { "status": "canceled" }); }}>
                    <i className="fas fa-exclamation-triangle mr-1" style={{ pointerEvents: "none" }}></i>取引キャンセル
                </button>
            </div>)
        if (orderStatus == "canceled" && position == "owner") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center m-2">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)
        if (orderStatus == "accepted" && position == "owner") tailConsoleButtons.push(
            <div className="d-flex flex-column text-center m-2">
                <button className="btn btn-danger btn-lg m-1" type="button" data-dismiss="modal"
                    onClick={() => { deleteOrder(tsuid) }}>
                    <i className="fas fa-trash-alt mr-1" style={{ pointerEvents: "none" }}></i>削除
                </button>
            </div>)

        return (
            <div className="col-12 oszv-column border">
                <a className="row" data-toggle="modal" data-target={"#V" + tsuid + "_orderModal"}>
                    <div className="col-sm-4 col-lg-2">
                        {orderStatus == "ordering" ? <h5 style={{ color: "black" }}>取引中</h5> : <div></div>}
                        {orderStatus == "canceling" ? <h5 style={{ color: "chocolate" }}>キャンセル申請中</h5> : <div></div>}
                        {orderStatus == "canceled" ? <h5 style={{ color: "darkred" }}>キャンセル済</h5> : <div></div>}
                        {orderStatus == "accepted" ? <h5 style={{ color: "darkblue" }}>取引済</h5> : <div></div>}
                    </div>
                    <h5 className="col-sm-8 col-lg-3">{Unixtime2String(Number(tsuid.split("_")[0]))}</h5>
                    <h3 className="col-sm-12 col-lg-7">名称: {orderName}</h3>
                    <h6 className="col-sm-12 col-lg-12">メッセージ: {orderMessage}</h6>
                </a>
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
                                <div className="p-1" style={{ backgroundColor: "beige", border: "3px double silver" }}>
                                    {tmpSwitch == "orderMessage" ?
                                        <div className="d-flex flex-column text-center">
                                            <h5>Message</h5>
                                            <textarea className="form-control" rows={4} value={tmpText}
                                                onChange={(evt: any) => { setTmpText(evt.target.value) }}></textarea>
                                            <button className="btn btn-success btn-lg m-1" type="button"
                                                onClick={() => {
                                                    updateOrder(tsuid, { "message": tmpText });
                                                    setTmpText(""); setTmpSwitch("");
                                                }}>
                                                <i className="fas fa-paper-plane mr-1" style={{ pointerEvents: "none" }}></i>変更する
                                            </button>
                                            <button className="btn btn-secondary btn-lg m-1" type="button"
                                                onClick={() => { setTmpText(""); setTmpSwitch(""); }}>
                                                <i className="fas fa-times mr-1" style={{ pointerEvents: "none" }}></i>変更中止
                                            </button>
                                        </div>
                                        :
                                        <div>
                                            <h5><i className="fas fa-comment-dots mr-1" style={{ pointerEvents: "none" }}></i>Message
                                                <i className="fas fa-pencil-alt faa-wrench animated-hover ml-2" style={{ color: "saddlebrown" }}
                                                    onClick={() => { setTmpText(orderMessage); setTmpSwitch("orderMessage"); }}></i>
                                            </h5>
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
    const dispPosition = () => {
        if (position == "owner")
            return (
                <div className="d-flex justify-content-end form-inline oszv-position"><h4>提供者</h4>
                    <button className="btn btn-link btn-lg ml-3" onClick={() => { setPosition("client") }}>
                        購買者として操作
                    </button>
                </div>
            )
        if (showUid == uid && position == "client")
            return (
                <div className="d-flex justify-content-end form-inline oszv-position"><h4>購買者</h4>
                    <button className="btn btn-link btn-lg ml-3" onClick={() => { setPosition("owner") }}>
                        提供者として操作
                    </button>
                </div>
            )
        if (showUid != uid && position == "client")
            return (
                <div className="d-flex justify-content-end form-inline oszv-position"><h4>購買者</h4>
                    <button className="btn btn-link btn-lg ml-3" onClick={() => { setPosition("client"); setShowUid(uid) }}>
                        自分の店舗に行く
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
                                onClick={() => { updateShop({ "shopName": tmpText }); setTmpText(""); setTmpSwitch(""); }}>
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
                <button className="btn btn-link mx-2" onClick={() => { updateShop({}) }}>
                    <h3>店を立てる</h3>
                </button>
            )
        return (<h2>店が存在しません</h2>)
    }
    const itemColumn = () => {
        const tmpRecodes = [];
        const tsuids = Object.keys(dbOszv_s).sort();
        if (tsuids.length == 0) return (<h4 className="text-center">商品がありません</h4>)
        for (var i = 0; i < tsuids.length; i++) {
            tmpRecodes.push(itemModal(tsuids[i], dbOszv_s[tsuids[i]]["name"], dbOszv_s[tsuids[i]]["imageUrl"]))
        }
        return (<div className="row">{tmpRecodes}</div>)
    }
    const orderColumn = () => {
        const tmpRecodes = [];
        if (position == "client") {
            const tsuids = Object.keys(dbOszv_c).sort();
            if (tsuids.length == 0) return (<h4 className="text-center">注文ががありません</h4>)
            for (var i = 0; i < tsuids.length; i++) {
                tmpRecodes.push(orderModal(tsuids[i], dbOszv_c[tsuids[i]]["name"], dbOszv_c[tsuids[i]]["message"],
                    dbOszv_c[tsuids[i]]["imageUrl"], dbOszv_c[tsuids[i]]["status"]))
            }
        }
        if (position == "owner") {
            const tsuids = Object.keys(dbOszv_c).sort();
            if (tsuids.length == 0) return (<h4 className="text-center">注文ががありません</h4>)
            for (var i = 0; i < tsuids.length; i++) {
                tmpRecodes.push(orderModal(tsuids[i], dbOszv_c[tsuids[i]]["name"], dbOszv_c[tsuids[i]]["message"],
                    dbOszv_c[tsuids[i]]["imageUrl"], dbOszv_c[tsuids[i]]["status"]))
            }
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
                <ul className="nav nav-tabs nav-fill mb-2 mt-2" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">
                            <b>商品一覧</b>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="item2-tab" data-toggle="tab" href="#item2" role="tab" aria-controls="item2" aria-selected="false">
                            <b>注文履歴</b>
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
        <div>
            {position == "client" ?
                <div className="p-1">
                    {appBody()}
                </div> :
                <div className="p-1" style={{ backgroundColor: "#f1f1ff" }}>
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