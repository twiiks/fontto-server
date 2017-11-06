import React, {Component} from 'react';

// UI Components
import {RaisedButton} from 'material-ui';

export class Test extends Component {
    constructor(props) {
        super(props);
        this.enqueueTest = this.enqueueTest.bind(this);
    }

    enqueueTest(){
        Meteor.call('testEnqueue', function(err, res){
            console.log(err);
            console.log(res);
        })
    }

    render() {
        return (
            <div className="test">
                <RaisedButton label="ENQUEUE TEST"
                              onTouchTap={this.enqueueTest}
                              fullWidth={true} />
            </div>
        );
    }
}
