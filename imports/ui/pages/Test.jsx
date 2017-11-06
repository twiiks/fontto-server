import React, {Component} from 'react';

// UI Components
import {RaisedButton} from 'material-ui';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

function alertHTML(result) {
    return '<h1>' + result.result + '</h2>' + '<div>' + result.message + '</p>';
}

export class Test extends Component {
    constructor(props) {
        super(props);
        this.enqueueTest = this.enqueueTest.bind(this);
    }

    enqueueTest() {
        Meteor.call('testEnqueue', function (err, res) {
            if (err) {
                Alert.error(alertHTML(err), {html: true});
            }

            Alert.success(alertHTML(res), {html: true});
        })
    }

    render() {
        return (
            <div className="test">
                <RaisedButton label="ENQUEUE TEST"
                              onTouchTap={this.enqueueTest}
                              fullWidth={true}/>

                <Alert effect='jelly' stack={{limit: 5}}/>
            </div>
        );
    }
}
