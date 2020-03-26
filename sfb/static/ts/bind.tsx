
import React from 'react';
import ReactDOM from "react-dom";

import {Acc} from "./component/acc";
import {Hello} from "./component/index2";


ReactDOM.render(<Acc/>, document.getElementById("acc"));

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);
