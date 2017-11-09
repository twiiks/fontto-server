import React, {Component} from 'react';
import {RaisedButton} from 'material-ui';

export class Button extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <RaisedButton
                label={this.props.label}
                className="button"/>
        );
    }
}
