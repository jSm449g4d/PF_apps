//plz use React and Firebase

function Popmaillogin() {
    return (
        <div>
            <h1>ASASSASAS</h1>

            <div className='popup' style="z-index:1;display:block;position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(51,51,51,0.6);margin-top:0px;">
                <div className='popup_inner' style="top:10%;left:25%;width:50%;height:auto;"> aaacaa</div>
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
class Tstreact2 extends React.Component {
    render() {
        return (<input type="submit" value="Submit" />
        );
    }
};
ReactDOM.render(
    <Tstreact />, document.getElementById('davra'));
