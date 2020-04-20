import React from 'react';

interface State { }

// IndexPage
export class App_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    componentDidMount() { }
    componentDidUpdate(prevProps: object, prevState: State) { }
    componentWillUnmount() { }

    // functions
    _tick() { }

    // renders
    render() {
        return (
        <div>
            {window.location.href = "./wordpress"}
        </div>
        );
    };
};
