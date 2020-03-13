//plz use React and Firebase

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

function Popmaillogin() {
    return (
        <div>
            <h1>ASASSASAS</h1>

            <div style={customStyles}>
                <div> aaacaa</div>
            </div>

        </div>
    )
}

class Tstreact extends React.Component {

    handleSubmit(event) {
        this.setState({
            showPopup: !this.state.showPopup
        });
    };

    constructor(props) {
        super(props);
        this.state = { value: 'SUBmit', showPopup: false };
    };
    render() {
        return (<p>
            <label>
                Name:
                </label>
            <input type="button" value={this.state.value} onClick={this.handleSubmit.bind(this)} />


            {this.state.showPopup ?
                <Popmaillogin text='Close Me' closePopup={this.handleSubmit.bind(this)} />
                : null}
        </p>
        );

    }
};
ReactDOM.render(
    <Tstreact />, document.getElementById('davra'));
