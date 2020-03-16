//plz use react-bootstrap and Firebase

class Mypage_tag extends React.Component {
    load_profile(e) {
        db.collection("mypage").doc(this.state.uid).get().then(
            function (doc) {
                if (doc.exists) {
                    this.setState({ profile: doc.data() })
                } else { alert("Error:" + this.state.uid + "_document_doesnt_exist") }
            }
        )
    }

    handleChange(e) {
        let name = e.target.name;
        this.setState({ [name]: e.target.value })
    }

    constructor(props) {
        super(props);
        this.state = { uid: "", profile: null };
    };

    render() {
        var user = firebase.auth().currentUser
        this.load_profile()
        return (
            <div>
                {user ?
                    <div>
                        {this.state.profile["uid"]}<br />
                        {this.state.profile["timestamp"]}
                    </div>
                    : <p>Plz login</p>}
            </div>

        );
    };
};

ReactDOM.render(
    <Mypage_tag />, document.getElementById('mypage_tag'))
firebase.auth().onAuthStateChanged(function (user) {
    ReactDOM.render(
        <Mypage_tag />, document.getElementById('mypage_tag'))
})