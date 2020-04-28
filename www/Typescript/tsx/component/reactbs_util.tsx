import React from 'react';

export const bsCarousel = (targetId: string, contents: any[], dataInterval: string = "50000") => {
    const _indicator = (targetId: string, listNumber: number = 1) => {
        const _style = { backgroundColor: "olive" }
        const _listBar = [<li className="active" data-target={"#" + targetId} data-slide-to="0" style={_style}></li>]
        for (let i = 1; i < listNumber; i++) {
            _listBar.push(<li data-target={"#" + targetId} data-slide-to={String(i)} style={_style}></li>)
        }
        return (
            <ol className="carousel-indicators" style={{ pointerEvents: "none", }}>
                {_listBar}
            </ol>
        )
    }
    if (contents.length < 1) { return (<div />) }
    const _listContents = [<div className="carousel-item active col-12">{contents[0]}</div>]
    for (let i = 1; i < contents.length; i++) {
        _listContents.push(<div className="carousel-item col-12">{contents[i]}</div>)
    }
    return (
        <div id={targetId} className="carousel slide row" data-ride="carousel" data-interval={dataInterval} >
            <div className="carousel-inner">
                {_indicator(targetId, contents.length)}
                {_listContents}
                <a className="carousel-control-prev" href={"#" + targetId} role="button" data-slide="prev">
                    <i className="fas fa-chevron-circle-left fa-lg" style={{ color: "olive", pointerEvents: "none", }}></i>
                </a>
                <a className="carousel-control-next" href={"#" + targetId} role="button" data-slide="next">
                    <i className="fas fa-chevron-circle-right fa-lg" style={{ color: "olive", pointerEvents: "none", }}></i>
                </a>
            </div>
        </div>
    )

}
