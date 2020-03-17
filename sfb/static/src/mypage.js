//plz use react-bootstrap and Firebase

class Mypage_tag extends React.Component {
    load_profile() {
        db.collection("mypage").doc(this.state.uid).get().then(
            function (doc) {
                if (doc.exists) {
                    this.setState({ profile: doc.data() })
                } else { alert("Error:" + this.state.uid + "_document_doesnt_exist") }
            }
        )
    }

    constructor(props) {
        super(props);
        this.state = { uid: "", pr: "", profile: null };
        firebase.auth().onAuthStateChanged(function (user) {
            this.setState({})
        })
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
                        {this.load_profile}
                        aaaaas
                    </div>
                    : <div>Plz login</div>}
            </div>
        );
    };

};



ReactDOM.render(
    <Mypage_tag />, document.getElementById('mypage_tag'))
