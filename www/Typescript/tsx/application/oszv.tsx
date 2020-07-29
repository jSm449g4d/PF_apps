import React, { useState, useEffect } from 'react';
import { dbFieldDelete, useAuth, useDb } from "../component/firebaseWrapper";
import { stopf5, jpclock } from "../component/util_tsx";
import { rejects } from 'assert';

export const AppMain = () => {
    const [uid] = useAuth()
    const [shop, setservice] = useState("とある飲食店")
    const [tmpShop, setTmpShop] = useState(shop)
    const [tmpContent, setTmpContent] = useState("")
    const [tmpFile, setTmpFile] = useState(null)
    const [position, setPosition] = useState("client")//client,owner

    const [dbOszv_s, dispatchOszv_s] = useDb()
    const [dbOszv_c, dispatchOszv_c] = useDb()
    const [dbMypage, dispatchMypage] = useDb()
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_s/" + shop }); }, [shop])
    useEffect(() => { dispatchOszv_s({ type: "setUri", uri: "oszv_c/" + uid }); }, [uid])
    useEffect(() => { dispatchMypage({ type: "setUri", uri: "mypage/" + uid }) }, [uid])

    // jpclock (decoration)
    const [jpclockNow, setJpclockNow] = useState("")
    useEffect(() => {
        const _intervalId = setInterval(() => setJpclockNow(jpclock()), 500);
        return () => clearInterval(_intervalId);
    }, []);

    const changeToOwner= ()=>{
        dbOszv_s
    }

    const itemModal = (num: string) => {
        return (
            <div className="col-sm-6 col-md-4 col-lg-2">
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
            <div className="col-12">
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
    // renders
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
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h3>{shop}</h3>
                    <div className="form-inline">
                        {position == "client" ?
                            <div>現在: <b>客</b>
                                <button className="btn btn-link btn-sm ml-5" onClick={() => { setPosition("owner") }}>
                                    店主として操作
                                </button>
                            </div>
                            :
                            <div>現在: <b>店主</b>
                                <button className="btn btn-link btn-sm ml-5" onClick={() => { setPosition("client") }}>
                                    客として操作
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <ul className="nav nav-tabs nav-fill mb-2" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">
                            <b>サービス</b>
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
                                    <b>+サービスを追加</b>
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