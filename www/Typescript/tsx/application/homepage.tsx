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
        const titleLogoStyle: any = {
            borderTop: "solid 1px gray",
            borderBottom: "solid 1px gray",
            fontWeight: "bold",
            textShadow: "4px 4px 1px rgba(30,30,30,0.2)",
            color: "mediumturquoise",
        }
        return (
            <h1 className="d-flex justify-content-center solid_line">
                <div style={titleLogoStyle}>VPSdeWP の ぽ～とふぉりお</div>
            </h1>
        )
    }
    const topicsSlide = () => {
        const topicBackStyle: any = {
            backgroundColor: "rgba(250,250,250,0.8)",
            width: 300,
            height: 300,
            margin: 2,
            padding: 2,
        }
        //<div className="w-50"><img src="/static/img/aircraft-2795557_1280.jpg"></img></div>,
        const carouselContent = [
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Nicoapi</div>,
            <div className="d-flex justify-content-center align-content-center" style={topicBackStyle}>Tptef</div>,
        ]

        return (
            <div className="d-flex justify-content-center">
                <div className="m-3">
                    {bsCarousel("topicBlockCarousel", carouselContent)}
                </div>
                <div className="m-3">
                    {bsCarousel("topicBlockCarousel3", carouselContent)}
                </div>

            </div>
        )
    }

    return (
        <div className="p-2 bg-light" style={bgImage}>
            <div>{titleLogo()}</div>
            <div>{topicsSlide()}</div>
            Under Construction<br />

        </div>
    );
};
//            <iframe width="560" height="315" src="https://www.youtube.com/embed/-i9e5bNPqVI" frameBorder="0"
//                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
