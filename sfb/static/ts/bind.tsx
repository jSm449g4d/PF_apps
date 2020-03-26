
import React from 'react';
import ReactDOM from "react-dom";

import {Account_tsx} from "./component/account";
import {Hello} from "./component/index2";


ReactDOM.render(<Account_tsx/>, document.getElementById("account_tsx"));

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);
