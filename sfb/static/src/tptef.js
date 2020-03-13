document.getElementById('davra').innerHTML += "AAAAD";
class Tstreact extends React.Component {
    handleSubmit(event) { alert('A name was submitted: ' + this.state.value); event.preventDefault(); };
    constructor(props) {
        super(props); this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this); this.handleSubmit =
            this.handleSubmit.bind(this);
    };
    render() {
        return (
            <input type="submit" value="Submit" />
            /*
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>            
            */
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
    <Tstreact2 />, document.getElementById('davra'));
    