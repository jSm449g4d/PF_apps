import React from 'react';
import "../stylecheets/style.sass";

const bgImage: any = {
    //backgroundColor: "lavender",
    backgroundImage: "url(/static/img/aircraft-2795557_1280.jpg)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
}

export const AppMain = () => {
    // functions
    // renders
    const titleLogo = () => {
        return (
            <div className="row text-center mt-2">
                <div className="col-lg-2" />
                <h1 className="d-none d-md-block col-lg-8 titlelogo">VPSdeWP の ホームページ</h1>
                <h1 className="d-block d-md-none col-12 text-center titlelogo "><div>VPSdeWP</div><div>の</div><div>ホームページ</div>
                </h1>
                <div className="col-lg-2" >
                    <button className="flex-fill btn btn-info btn-lg btn-push" data-toggle="collapse" data-target="#homepage_ziko">
                        <i className="fas fa-person-booth mr-1" style={{ pointerEvents: "none" }}></i>マイスキル
                    </button>
                </div>
                <div className="collapse col-md-12" id="homepage_ziko">
                    <div className="blackboard-transparent">
                        <h3>
                            主な技術
                        </h3>
                        <div>
                            <i className="fab fa-ubuntu fa-2x mr-1"></i>
                            <i className="fab fa-react fa-2x mr-1"></i>
                            <i className="fab fa-python fa-2x mr-1"></i>
                            <i className="fab fa-bootstrap fa-2x mr-1"></i>
                            <i className="fab fa-docker fa-2x mr-1"></i>
                            <i className="fab fa-sass fa-2x mr-1"></i>
                        </div>
                        <div>
                            <h5>GCP: Firebase, CloudBuild, CloudRun, CloudFunction</h5>
                            <h5>ML: Tensorflow, Word2Vec</h5>
                        </div>
                        <h3 className="mt-3">
                            <i className="fas fa-broadcast-tower mr-1"></i>技術発信:
                            <i className="fab fa-wordpress fa-btn-goldbadge fa-lg mr-1 ml-2"
                                onClick={() => window.location.href = "https://huxiin.ga/wordpress"}></i>
                            <i className="fab fa-github fa-btn-goldbadge fa-lg mr-1"
                                onClick={() => window.location.href = "https://github.com/jSm449g4d/"}></i>
                        </h3>
                        <div>
                            <button className="btn btn-secondary btn-lg btn-push m-2" data-toggle="collapse" data-target="#homepage_ziko">
                                <i className="fas fa-caret-up mr-1" style={{ pointerEvents: "none" }} ></i>Close
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const appIndexColumns = () => {
        return (
            <div className="p-3">
                <div className="row text-center">
                    <div className="col-12 slidein-1">
                        <h4 style={{ backgroundColor: "rgba(250,250,250,0.8)", }}>アプリ一覧</h4>
                    </div>
                    <div className="col-sm-6 col-md-4 col-lg-3 p-1 fadein-1">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" onClick={(evt) => { window.location.href = '/app_tsx.html?application=tptef' }}>
                                <div className="d-flex flex-column" style={{ height: "300px" }}>
                                    <h5>チャットアプリ</h5>
                                    <div className="flex-grow-1">
                                        ファイルのやり取りも可能なチャットルームです<br />
                                    </div>
                                    <b>開発状況: α版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 col-lg-3 p-1 fadein-2">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" onClick={(evt) => { window.location.href = '/app_tsx.html?application=mypage' }}>
                                <div className="d-flex flex-column" style={{ height: "300px" }}>
                                    <h5>Mypage</h5>
                                    <div className="flex-grow-1">
                                        チャットアプリや注文受付システムで使用する、ユーザー名やアカウントを管理します<br />
                                    </div>
                                    <b>開発状況: α版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    {/*ボタンinボタンは、setTimeoutで遅延させることで順序を付けられる*/}
                    <div className="col-sm-6 col-md-4 col-lg-3 p-1 fadein-4">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" onClick={(evt) => { setTimeout(() => window.location.href = '/app_tsx.html?application=oszv', 500) }}>
                                <div className="d-flex flex-column" style={{ height: "300px" }}>
                                    <h5>注文受付システム</h5>
                                    <button className="btn btn-success btn-lg btn-push rounded-pill m-1"
                                        onClick={(evt) => window.location.href = "/app_tsx.html?application=oszv&portfolio"}>
                                        チュートリアルに進む
                                    </button>
                                    <div className="flex-grow-1">
                                        「個人~小規模の飲食店等の注文受付システム」を題材に制作しました。<br/>
                                        「チュートリアル」は一部UIを省略しています<br/>
                                    </div>
                                    <b>開発状況: α版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const githubIndexColumns = () => {
        return (
            <div className="p-3">
                <div className="row text-center">
                    <div className="col-12 slidein-1">
                        <h4 style={{ backgroundColor: "rgba(225,160,225,0.8)", }}>Github一覧</h4>
                    </div>
                    <div className="col-sm-6 col-md-4 col-lg-3 p-1 fadein-1">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" onClick={(evt) => { window.location.href = 'https://github.com/jSm449g4d/PF_apps' }}>
                                <div className="d-flex flex-column" style={{ height: "200px" }}>
                                    <h5>PF_apps</h5>
                                    <div className="flex-grow-1">
                                        このサイトのリポジトリです
                                    </div>
                                    <b>開発状況: β版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 col-lg-3 p-1 fadein-2">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" onClick={(evt) => { window.location.href = 'https://github.com/jSm449g4d/hleb' }}>
                                <div className="d-flex flex-column" style={{ height: "200px" }}>
                                    <h5>хлеб (半完全栄養食)</h5>
                                    <div className="flex-grow-1">
                                        私の日常食について
                                        <img className="img-fluid" src="/static/img/hleb.jpg" style={{ height: 100, objectFit: "contain" }} />
                                    </div>
                                    <b>開発状況: 第四世代: 運用中</b>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={bgImage}><div style={{ background: "rgba(255,255,255,0.5)", }}>
            <div>{titleLogo()}</div>
            <div>{appIndexColumns()}</div>
            <div>{githubIndexColumns()}</div>
        </div></div>
    );
};

//titleLogo
export const titleLogo = () => {
    return (<div style={{ fontFamily: "Impact", color: "black" }}>ホームページ</div>)
}