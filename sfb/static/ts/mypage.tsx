
import React from 'react';
import ReactDOM from "react-dom";

import { Account_tsx } from "./component/account";

interface State {
    uid: string, image_url: string, nickname: string, pr: string, accessed_by: string
}

export class Mypage_tsx extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            uid: "", image_url: "No_Image",
            nickname: "窓の民は名無し",
            pr: "私はJhon_Doe。窓の蛇遣いです。",
            accessed_by: "FB"
        };
    }

    render() {
        return (
            <div>
                {this.state.uid != "" ?
                    <div>
                        <div className="m-2 p-1" style={{ background: "khaki" }}>
                            <h4 className="d-flex justify-content-between">
                                <div>{this.state.nickname}</div>
                                <div className="ml-auto">
                                    <div className="form-inline">
                                    </div>
                                </div>
                            </h4>
                            <div className="d-flex">
                                <div className=""></div>
                                <div className="bg-light m-1">
                                    <div className="d-flex justify-content-between bg-white m-1">
                                        <h5 className="">PR</h5>
                                        <div className="ml-auto"></div>
                                    </div>
                                    <h6 className="">{this.state.pr}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <h4 className="m-2">This application cant use without login</h4>
                }
            </div>
        );
    };
};


ReactDOM.render(<Account_tsx />, document.getElementById("account_tsx"));

ReactDOM.render(
    <Mypage_tsx />,
    document.getElementById("example")
);

