import React from 'react';

export const bsCarousel = (targetId: string, contents: any[]) => {
    const _indicator = (targetId: string, listNumber: number = 1) => {
        const _style = { backgroundColor:"olive" }
        const _listBar = [<li className="active" data-target={"#" + targetId} data-slide-to="0" style={_style}></li>]
        for (let i = 1; i < listNumber; i++) {
            _listBar.push(<li data-target={"#" + targetId} data-slide-to={String(i)} style={_style}></li>)
        }
        return (
            <ol className="carousel-indicators">
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
        <div id={targetId} className="carousel slide row" data-ride="carousel">
            <div className="carousel-inner">
                {_indicator(targetId, contents.length)}
                {_listContents}
                <a className="carousel-control-prev" href={"#" + targetId} role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a className="carousel-control-next" href={"#" + targetId} role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
            </div>
        </div>
    )

}
