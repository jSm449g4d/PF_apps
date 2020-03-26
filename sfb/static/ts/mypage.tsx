
import React from 'react';
import ReactDOM from "react-dom";

import { Account_tsx,auth,storage} from "./component/account";

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
        setInterval(() => {
            if (auth.currentUser) {
                if (this.state.uid != auth.currentUser.uid) this.setState({ uid: auth.currentUser.uid });
            }
            else {
                if (this.state.uid != "") this.setState({ uid: "" });
            }
        }, 100)
    }

    
    icon_upload() {
        let storageRef = storage.ref("mypage/" + this.state.uid + "/icon.img");
        return (
            <div>
                <button type="button" className="btn btn-outline-success btn-sm" onClick={(evt) => {
                    $(evt.currentTarget.children[0]).click()
                }}>Upload_Icon
                <input type="file" className="d-none" onChange={(evt) => {
                        if (window.confirm('Are you really submitting?\n' + evt.target.files[0].name)) {
                            storageRef.put(evt.target.files[0]);
                        }; this.setState({});
                    }} accept="image/jpeg,image/png" /></button>
            </div>
        )
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
                                    <div className="form-inline">{this.icon_upload()}
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

ReactDOM.render(<Account_tsx/>, document.getElementById("account_tsx"));

ReactDOM.render(
    <Mypage_tsx />,
    document.getElementById("mypage_tsx")
);

