import React from 'react';
import { bsCarousel } from "../component/reactbs_util";
import "../stylecheets/style.sass";

const bgImage: any = {
    backgroundImage: "url(/static/img/aircraft-2795557_1280.jpg)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
}

export const AppMain = () => {
    // functions
    // renders
    const titleLogo = () => {
        const VPSdeWP_no_zikoshoukaiButton = () => {
            return (
                <div>
                    <button className="btn btn-info m-2" data-toggle="collapse" data-target="#VPSdeWPnoCollapse">
                        <i className="fas fa-person-booth mr-1"></i>About me
                    </button>
                </div>
            )
        }
        const VPSdeWPnozikoshoukaiCollapse = () => {
            return (
                <div className="blackboard-transparent">
                    <h3>
                        おはようございました
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
                    </div>
                    <h3 className="mt-3">
                        <i className="fas fa-broadcast-tower mr-1"></i>技術発信
                    </h3>
                    <div className="m-2" style={{ color: "gold" }}>
                        <i className="fab fa-wordpress fa-2x faa-wrench animated-hover mr-1"
                            onClick={() => window.location.href = "https://huxiin.ga/wordpress"}></i>
                        <i className="fab fa-github fa-2x faa-wrench animated-hover mr-1"
                            onClick={() => window.location.href = "https://github.com/jSm449g4d/"}></i>
                    </div>
                    <div>
                        <button className="btn btn-sm btn-secondary m-2" data-toggle="collapse" data-target="#VPSdeWPnoCollapse">
                            <i className="fas fa-caret-up fa-btn" ></i>Close
                        </button>
                    </div>
                </div>
            )
        }
        return (
            <div className="row" style={{ textAlign: "center", }}>
                <div className="col-md-2" />
                <div className="col-md-8"><h1 className="titlelogo">VPSdeWP の ぽ～とふぉりお</h1></div>
                <div className="col-md-2" >{VPSdeWP_no_zikoshoukaiButton()}</div>{/* VPSdeWPnoCollapse*/}
                <div className="collapse col-md-12" id="VPSdeWPnoCollapse">
                    {VPSdeWPnozikoshoukaiCollapse()}{/* VPSdeWPnoCollapse*/}
                </div>
            </div>
        )
    }
    const topicsSlide = () => {
        const topicBackStyle: any = {
            backgroundColor: "rgba(250,250,250,0.8)",
            height: 200,
            padding: 2,
        }
        const carouselApplication = [
            <div style={topicBackStyle}>Nicoapi</div>,
            <div style={topicBackStyle}>Mypage</div>,
            <div style={topicBackStyle}>Tptef</div>,
        ]
        const carouselYoutube = [
            <div style={topicBackStyle}>Tptef</div>,
        ]
        const carouselX = [
            <div style={topicBackStyle}>Tptef</div>,
            <div style={topicBackStyle}>Tptef</div>,
            <div style={topicBackStyle}>Tptef</div>,
            <div style={topicBackStyle}>Tptef</div>,
        ]

        return (
            <div className="row" style={{ textAlign: "center" }}>
                <div className="col-lg-12 col-md-12  fadein-1">
                    <h4 style={{ color: "cadetblue", backgroundColor: "rgba(250,250,250,0.8)", }}>
                        制作物一覧
                    </h4>
                    {bsCarousel("carouselApplication", carouselApplication)}
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 bg-light" style={bgImage}>
            <div className="m-1">{titleLogo()}</div>
            <div className="m-1">{topicsSlide()}</div>
        </div>
    );
};
