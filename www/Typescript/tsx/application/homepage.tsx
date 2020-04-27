import React, { useState } from 'react';
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
        const [topicBlockIterator, setTopicBlockIterator] = useState(0);
        const tolicBlock = (_text: string) => {
            const tolicBlockBack: any = {
                backgroundColor: "rgba(250,250,250,0.8)",
            }
            return (
                <div className="d-flex justify-content-center m-2 p-1" style={tolicBlockBack}>
                    てすと{_text}
                </div>
            )
        }
        const _topicBlocks = [tolicBlock("1"), tolicBlock("2"), tolicBlock("3"), tolicBlock("4"), tolicBlock("5")]
        if (topicBlockIterator > _topicBlocks.length - 3) { setTopicBlockIterator(0); };
        if (topicBlockIterator < 0) { setTopicBlockIterator(_topicBlocks.length - 3); };
        /*
            <div className="d-flex justify-content-center align-content-center">
                <i className="fas fa-caret-left fa-4x mr-1" style={{ color: "lightcyan" }}
                    onClick={() => { setTopicBlockIterator(topicBlockIterator - 1) }}></i>
                {_topicBlocks[topicBlockIterator + 0]}
                {_topicBlocks[topicBlockIterator + 1]}
                {_topicBlocks[topicBlockIterator + 2]}
                <i className="fas fa-caret-right fa-4x mr-1" style={{ color: "lightcyan" }}
                    onClick={() => { setTopicBlockIterator(topicBlockIterator + 1) }}></i>
            </div>*/
        return (
            <div id="topicBlockCarousel" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li className="active" data-target="#topicBlockCarousel" data-slide-to="0"></li>
                    <li data-target="#topicBlockCarousel" data-slide-to="1"></li>
                    <li data-target="#topicBlockCarousel" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="/static/img/aircraft-2795557_1280.jpg" alt="First slide">
                        </img>
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="/static/img/aircraft-2795557_1280.jpg" alt="Second slide">
                        </img>
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="/static/img/aircraft-2795557_1280.jpg" alt="Third slide">
                        </img>
                    </div>
                    <a className="carousel-control-prev" href="#topicBlockCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#topicBlockCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
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
