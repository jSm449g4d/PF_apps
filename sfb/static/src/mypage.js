//plz use react-bootstrap and Firebase

class Mypage_tag extends React.Component {
    load_profile() {
        alert("CD");
        db.collection("mypage").doc(firebase.auth().currentUser.uid).get().then(
            (doc)=> {
                alert("CC");
                if (doc.exists) {
                    alert("Hello World!1");
                    this.setState({ pr: doc.data()["pr"] });
                } else {
                    alert("Hello World!");
                    tm = new Date();
                    doc.set({
                        "nickname": "窓の民は名無し",
                        "pr": "私はJhon_Doe。窓の蛇遣いです。",
                        "accessed_by": "FB",
                        "timestamp": tm.getTime()
                    });
                }
            }
        )
    }
    componentDidMount(prevProps, prevState) {
        load_profile()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.uid != prevState.uid) {load_profile()}
    }

    constructor(props) {
        super(props);
        this.state = { uid: "", pr: "", profile: null };
        this.load_profile = this.load_profile.bind(this);
        setInterval(() => {
            if (firebase.auth().currentUser) {
                this.setState({ uid: firebase.auth().currentUser.uid });
            }
            else {
                this.setState({ uid: "" });
            }
        }, 100)
        
    };

    render() {
        var user = firebase.auth().currentUser
        return (
            <div>
                {this.state.uid != "" ?
                    <div>
                        {this.state.pr}
                    </div>
                    : 
                    
                    <div>Plz login<button onload="()=>alert('b')"/></div>}
            </div>
        );
    };
};
ReactDOM.render(
    <Mypage_tag />, document.getElementById('mypage_tag'))

                    //    {this.state.pr}