//plz use React and Firebase

function Popmaillogin() {
    return (
        <div className='popup'>
            <div className='popup_inner'> aaacaa</div>
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
        this.state = { value: 'SUBmit', modalIsOpen: false };
    };

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        return (<p>
            <label>
                Name:
                </label>
            <input type="button" value={this.state.value} onClick={this.openModal} />


            {this.state.modalIsOpen ?

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
                    <button onClick={this.closeModal}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
                : null}
        </p>
        );

    }
};
//<Popmaillogin text='Close Me' closePopup={this.handleSubmit.bind(this)} />
class Tstreact2 extends React.Component {
    render() {
        return (<input type="submit" value="Submit" />
        );
    }
};
ReactDOM.render(
    <Tstreact />, document.getElementById('davra'));
