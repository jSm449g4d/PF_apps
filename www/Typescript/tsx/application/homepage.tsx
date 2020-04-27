import React, { useRef } from 'react';
import { useAuth } from "../component/firebaseWrapper";

const bgImage: any = {
    backgroundImage: "url(/static/img/aircraft-2795557_1280.jpg)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
}

export const AppMain = () => {
    const [uid] = useAuth()
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
        const topicBlockIterator = useRef(0);
        const tolicBlock = () => {
            return (
                <div className="d-flex justify-content-center solid_line">
                    てすと
                </div>)
        }
        const _topicBlocks = [tolicBlock(), tolicBlock(), tolicBlock(), tolicBlock(),]
        return (
            <div className="d-flex justify-content-center align-content-center">
                <i className="fas fa-caret-left fa-4x mr-1" style={{ color: "lightcyan" }}></i>
                {_topicBlocks[topicBlockIterator.current + 0]}
                {_topicBlocks[topicBlockIterator.current + 1]}
                {_topicBlocks[topicBlockIterator.current + 2]}
                <i className="fas fa-caret-right fa-4x mr-1" style={{ color: "lightcyan" }}></i>
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
