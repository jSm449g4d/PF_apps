import React from 'react';
import "../stylecheets/style.sass";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

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
                <h1 className="d-none d-md-block col-lg-8 titlelogo" >
                    VPSdeWP の ホームページ
                </h1>
                <h1 className="d-block d-md-none col-12 text-center titlelogo "><div>VPSdeWP</div><div>の</div><div>ホームページ</div>
                </h1>
                <div className="col-lg-2" >
                </div>
            </div>
        )
    }
    const aboutMe = () => {
        return (
            <div className="mx-3 my-1" style={{ background: "rgba(255,255,255,0.8)", border: "1px inset silver" }}>
                <ul>
                    <h3 className="mt-2">
                        <i className="fas fa-person-booth mr-1"></i>自己紹介
                    </h3>
                    <h4 className="mt-2">名前: 石原正敏</h4>
                    <h5 className="mt-2">現所属: 東京都立大学大学院システムデザイン学部 石川研究室</h5>
                    <h4 className="mt-2">履歴</h4>
                    <li>2022/3  東京都立大学大学院システムデザイン学部卒業予定</li>
                    <li>2018/3  法政大学理工学部機械工学科卒業</li>
                    <li>2014/3  東京成徳大学高校高等部卒業</li>
                    <details><summary>大学院時代の<b>謎の二年間</b>について</summary>
                        <ul>
                            <li>2018/4-2019/3: 浪人: AIの研究をするために大学院進学に向けて</li>
                            <li>2020/10-2021/9: 休学: もっと研究を掘り下げたい</li>
                        </ul>
                    </details>
                    <h4 className="mt-2">資格</h4>
                    <li>2018/11 基本情報技術者試験</li>
                    <li>2018/1  TOEIC 660点</li>
                    <li>2017/3  準中型免許</li>
                    <li>2015/3  普通自動二輪免許</li>
                    <li>2007/8  アマチュア無線技士4級</li>
                    <h4 className="mt-2">スキルセット</h4>
                    <li><i className="fab fa-react mr-1"></i>React/Typescript</li>
                    <li><i className="fab fa-python mr-1"></i>Flask/Python</li>
                    <li><i className="fab fa-cuttlefish mr-1"></i>C++</li>
                    <li><i className="fab fa-ubuntu mr-1"></i>Ubuntu</li>
                    <li><i className="fab fa-docker mr-1"></i>Docker</li>
                    <li><i className="fab fa-bootstrap mr-1"></i>Bootstrap4</li>
                    <li><i className="fab fa-sass mr-1"></i>Sass</li>
                    <li><i className="fas fa-database mr-1"></i>SQLite3</li>
                    <li>GCP: Firestore, GCS, CloudBuild, CloudRun, CloudFunction</li>
                    <li>ML: Tensorflow, Word2Vec, scikit-learn</li>
                    <h4 className="mt-2"><i className="fas fa-broadcast-tower mr-1"></i>Links
                        <a className="btn btn-link btn-lg btn-push" href="https://huxiin.ga/wordpress/"><b>
                            <i className="fab fa-wordpress mr-1"></i>https://huxiin.ga/wordpress/</b></a>
                        <a className="btn btn-link btn-lg btn-push" href="https://github.com/jSm449g4d/"><b>
                            <i className="fab fa-github mr-1"></i>https://github.com/jSm449g4d/</b></a>
                        <a className="btn btn-link btn-lg btn-push" href="https://www.wantedly.com/users/123640147"><b>
                            https://www.wantedly.com/users/123640147</b></a>
                    </h4>
                    <h5>連絡先: masatoshi.ishihara@mbr.nifty.com</h5>
                </ul>
            </div>
        )

    }
    const appIndexColumns = () => {
        return (
            <div className="p-3">
                <div className="row text-center">
                    <div className="col-12 slidein-1">
                        <h4 style={{ backgroundColor: "rgba(240,230,200,0.8)", }}>アプリ一覧</h4>
                    </div>
                    <div className="col-sm-6 col-md-4 p-1 fadein-1">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='/app_tsx.html?application=tptef'>
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>チャットアプリ</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hp_tptef.png" style={{ height: 150, objectFit: "contain" }} />
                                        ファイルのやり取り可能なチャットルーム<br />
                                        何かと利用頻度は高め<br />
                                    </div>
                                    <b>開発状況: α版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 p-1 fadein-2">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='/app_tsx.html?application=mypage' >
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>Mypage</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hp_mypage.png" style={{ height: 150, objectFit: "contain" }} />
                                        ユーザー名やアカウントを管理<br />
                                        他のWebアプリで参照されます<br />
                                    </div>
                                    <b>開発状況: α版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    {/*ボタンinボタンは、setTimeoutで遅延させることで順序を付けられる*/}
                    <div className="col-sm-6 col-md-4 p-1 fadein-3">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" onClick={(evt) => { setTimeout(() => window.location.href = '/app_tsx.html?application=oszv', 500) }}>
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>注文受付システム</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hp_oszv.png" style={{ height: 150, objectFit: "contain" }} />
                                        飲食店等の受付や注文をスムーズにして、暮らしを便利にする!<br />
                                        「評価モード」は一部UIを省略しています<br />
                                        <button className="btn btn-success btn-lg btn-push rounded-pill m-1"
                                            onClick={(evt) => window.location.href = "/app_tsx.html?application=oszv&portfolio"}>
                                            評価モードに進む
                                        </button>
                                    </div>
                                    <b>開発状況: α版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 p-1 fadein-4">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='https://sh2-tlnesjcoqq-an.a.run.app/'>
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>Flask通信</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hp_hakka.png" style={{ height: 150, objectFit: "contain" }} />
                                        「時間を軸とした、ホットのキーワードの可視化」<br />
                                        キーワード検索で、何時どれだけ記事にされたか<br />
                                        どんな記事があったのかが分かります!<br />
                                    </div>
                                    <b>開発状況: 完成!</b>
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
                    <div className="col-sm-6 col-md-4 p-1 fadein-1">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='https://github.com/jSm449g4d/Research' >
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>研究</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hp_research.png" style={{ height: 150, objectFit: "contain" }} />
                                            深層学習による少数学習データでの<br />2次元データの高品質化手法の提案<br />
                                        <ul>
                                            <li>超解像/ノイズ除去</li>
                                            <li>少ない画像数(100-1000枚)</li>
                                            <li>U-Net+Inception+VDSRな新モデル</li>
                                            <li>DIV2K/火星画像</li>
                                        </ul>
                                    </div>
                                    <b>開発状況: 研究中</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 p-1 fadein-2">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='https://github.com/jSm449g4d/PF_apps'>
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>PF_apps</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hp_pf_apps.png" style={{ height: 150, objectFit: "contain" }} />
                                        このホームページとWebアプリ
                                        <ul>
                                            <li>React/Typescript</li>
                                            <li>Flask/Python</li>
                                            <li>Firebase</li>
                                        </ul>
                                    </div>
                                    <b>開発状況: β版: 利用可</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 p-1 fadein-3">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='https://github.com/jSm449g4d/summerhackathon_vol2' >
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>Flask通信</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hakka.png" style={{ height: 150, objectFit: "contain" }} />
                                        2020/09/09~16に開催されたハッカソンの<b>入選</b>作品!!
                                        <ul>
                                            <li>チーム開発</li>
                                            <li>情報可視化で世の中を便利に!</li>
                                            <li>何時どれだけ、どんな記事?</li>
                                            <li>キーワード検索</li>
                                        </ul>
                                    </div>
                                    <b>開発状況: 完成!</b>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 p-1 fadein-4">
                        <div className="btn-col" style={{ background: "rgba(255,255,255,0.6)" }}>
                            <a className="a-nolink" href='https://github.com/jSm449g4d/hleb' >
                                <div className="d-flex flex-column" style={{ height: "380px" }}>
                                    <h5>хлеб (半完全栄養食)</h5>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <img className="img-fluid" src="/static/img/hleb.jpg" style={{ height: 150, objectFit: "contain" }} />
                                        私の日常食
                                        <ul>
                                            <li>低カロリー(900[kcal]前後)</li>
                                            <li>低コスト(500[円]以下)</li>
                                            <li>高たんぱく(100[g]以上)</li>
                                            <li>ケト食(糖質20[g]前後)</li>
                                            <li>人工甘味料(NAS)不使用</li>
                                        </ul>
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
            <div className="d-flex justify-content-around mx-1 p-1 slidein-1" style={{ background: "rgba(230,230,230,0.6)", border: "1px inset silver" }}>
                <a className="btn btn-link btn-lg btn-push" href="#homepage_aboutMe"><b>自己紹介</b></a>
                <a className="btn btn-link btn-lg btn-push" href="#homepage_appIndexColumns"><b>自作アプリ</b></a>
                <a className="btn btn-link btn-lg btn-push" href="#homepage_githubColumns"><b>Github</b></a>
            </div>
            <div id="homepage_aboutMe">{aboutMe()}</div>
            <div id="homepage_appIndexColumns">{appIndexColumns()}</div>
            <div id="homepage_githubColumns">{githubIndexColumns()}</div>
        </div></div>
    );
};

//titleLogo
export const titleLogo = () => {
    return (<div style={{ fontFamily: "Impact", color: "black" }}>ホームページ</div>)
}