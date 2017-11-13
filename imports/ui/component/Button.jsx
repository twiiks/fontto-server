import React, {Component} from 'react';
import {RaisedButton, FlatButton} from 'material-ui';

export class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let backgroundColor;
        let labelColor;
        let isRaised;

        if (!this.props.backgroundColor) {
            backgroundColor = '#333';
        }
        if (!this.props.labelColor) {
            labelColor = '#fdfdfd';
        }

        isRaised = !(!this.props.isRaised &&
            this.props.isRaised !== undefined);

        return (
            isRaised ?
                <RaisedButton
                    onTouchTap={this.props.onTouchTap}
                    backgroundColor={backgroundColor}
                    labelColor={labelColor}
                    label={this.props.label}
                    className={this.props.className}
                    fullWidth={this.props.fullWidth}
                    height={50}
                    disabled={this.props.disabled}
                />
                :
                <FlatButton
                    onTouchTap={this.props.onTouchTap}
                    label={this.props.label}
                    className={this.props.className}
                    disabled={this.props.disabled}
                />

        );
    }
}
