
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Acc} from "./acc";
import {Hello} from "./index2";

ReactDOM.render(<Acc />, document.getElementById("acc"));

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);
