import React, { useState } from 'react';
import { useAuth } from "../component/firebaseWrapper";
import { bsCarousel } from "../component/reactbs_util";

const bgImage: any = {
    backgroundImage: "url(/static/img/aircraft-2795557_1280.jpg)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
}

export const AppMain = () => {
    const [uid] = useAuth()
    // functions
    // renders
    const titleLogo = () => {
        const _style: any = {
            borderTop: "solid 1px gray",
            borderBottom: "solid 1px gray",
            fontWeight: "bold",
            textShadow: "4px 4px 1px rgba(30,30,30,0.2)",
            color: "mediumturquoise",
        }
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
                <div style={{ backgroundColor: "rgba(250,250,250,0.8)", padding: 2, }}>
                    <h3 className="d-flex justify-content-center">
                        現在求職中です
                    </h3>
                    <div className="d-flex justify-content-center">
                        <i className="fab fa-ubuntu fa-2x mr-1"></i>
                        <i className="fab fa-react fa-2x mr-1"></i>
                        <i className="fab fa-python fa-2x mr-1"></i>
                        <i className="fab fa-bootstrap fa-2x mr-1"></i>
                        <i className="fab fa-docker fa-2x mr-1"></i>
                    </div>
                    <div className="d-flex justify-content-center">
                        <h5>GCP: Firebase, CloudBuild, CloudRun, CloudFunction</h5>
                    </div>
                    <h3 className="d-flex justify-content-center">
                        <i className="fas fa-broadcast-tower mr-1"></i>技術発信
                    </h3>
                    <div className="d-flex justify-content-center">
                        <a className="fab fa-wordpress fa-2x mr-1" href="https://huxiin.ga/wordpress"></a>
                        <a className="fab fa-github fa-2x mr-1" href="https://github.com/jSm449g4d/"></a>
                    </div>
                    <div className="d-flex justify-content-center" >
                        <button className="btn btn-sm btn-secondary m-2" data-toggle="collapse" data-target="#VPSdeWPnoCollapse">
                            Close
                        </button>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <h1 className="d-flex justify-content-between">
                    <div />
                    <div style={_style}>VPSdeWP の ぽ～とふぉりお</div>
                    <div>{VPSdeWP_no_zikoshoukaiButton()}</div>{/* VPSdeWPnoCollapse*/}
                </h1>
                <div className="collapse" id="VPSdeWPnoCollapse">
                    {VPSdeWPnozikoshoukaiCollapse()}{/* VPSdeWPnoCollapse*/}
                </div>
            </div>
        )
    }
    const topicsSlide = () => {
        const topicBackStyle: any = {
            backgroundColor: "rgba(250,250,250,0.8)",
            height: 300,
            padding: 2,
        }
        //<div className="w-50"><img src="/static/img/aircraft-2795557_1280.jpg"></img></div>,
        const carouselApplication = [
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Nicoapi</div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Mypage</div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Tptef</div>,
        ]
        const carouselYoutube = [
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>
                <iframe src="https://www.youtube.com/embed/_fj9U6pVNkM" frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>
                <iframe src="https://www.youtube.com/embed/2dJfxy8DIto" frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>,
        ]
        const carouselX = [
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Tptef</div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Tptef</div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Tptef</div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Tptef</div>,
        ]

        return (
            <div className="row">
                <div className="col-4">
                    <h4 className="d-flex justify-content-center" style={{ color: "cadetblue" }}>
                        制作物一覧
                    </h4>
                    {bsCarousel("carouselApplication", carouselApplication)}
                </div>
                <div className="col-4">
                    <h4 className="d-flex justify-content-center" style={{ color: "darkgoldenrod" }}>
                        君が代RICAL COMMUNICATION
                    </h4>
                    {bsCarousel("topicBlockCarousel3s", carouselYoutube, "false")}
                </div>
                <div className="col-4">
                    <h4 className="d-flex justify-content-center">
                        工事中です
                    </h4>
                    {bsCarousel("arouselX", carouselX)}
                </div>

            </div>
        )
    }

    return (
        <div className="p-2 bg-light" style={bgImage}>
            <div>{titleLogo()}</div>
            <div>{topicsSlide()}</div>
            <div className="d-flex justify-content-end">
                <a className="fab fa-wordpress fa-2x mr-1" href="https://huxiin.ga/wordpress"></a>
                <a className="fab fa-github fa-2x mr-1" href="https://github.com/jSm449g4d/"></a>
            </div>
        </div>
    );
};
//            <iframe width="560" height="315" src="https://www.youtube.com/embed/-i9e5bNPqVI" frameBorder="0"
//                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
