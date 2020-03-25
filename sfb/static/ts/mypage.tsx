//plz use react-bootstrap and Firebase

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Nav, NavItem, Navbar, Row, Col} from "react-bootstrap";
import * as firebase from 'firebase/app';

export class Mypage extends React.Component{
    render() {
        return <h1>maipezi</h1>;
    }
    
}

ReactDOM.render(
    <Mypage />,
    document.getElementById("mypage")
);
