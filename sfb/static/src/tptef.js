//plz use React and Firebase

function al(){alert('A name was submitted!: ');}

class Tstreact extends React.Component {
    
    handleSubmit(event) {alert('A name was submitted: ');};//event.preventDefault();
    constructor(props) {
        super(props);
        this.state = { value: 'SUBmit' };
        /*this.handleChange = this.handleChange.bind(this);*/
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    render() {
        return (<p>
                <label>
                    Name:
                </label>
                <input type="button" value={this.state.value} onclick={al}/>
                </p>
        );
            //<input type="text" value={this.state.value} onChange={this.handleChange} />
            
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
    