document.getElementById('davra').innerHTML += "AAAAD";
class Tstreact extends React.Component {
    
    handleSubmit(event) { alert('A name was submitted: ' + this.state.value); event.preventDefault(); };
    /*constructor(props) {
        super(props); this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this); this.handleSubmit =
            this.handleSubmit.bind(this);
    };*/
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                </label>
                <input type="submit" value="Submit" />
            </form>
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
    