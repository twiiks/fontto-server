import React, {Component} from 'react';

// UI Components
import {RaisedButton, TextField} from 'material-ui';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

function alertHTML(result) {
    return '<h1>' + result.result + '</h2>' + '<div>' + result.message + '</p>';
}

export class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueName: '',
            userId: '',
            unicodes: []
        };
        this.enqueueTest = this.enqueueTest.bind(this);
        this.onQueueNameChange = this.onQueueNameChange.bind(this);
        this.onUserIdChange = this.onUserIdChange.bind(this);
        this.onUnicodesChange = this.onUnicodesChange.bind(this);
    }

    onQueueNameChange(e) {
        this.setState({
            queueName: e.target.value
        })
    }

    onUserIdChange(e) {
        this.setState({
            userId: e.target.value
        })
    }

    onUnicodesChange(e) {
        const unicodes = e.target.value.split(' ');
        this.setState({
            unicodes: unicodes
        })
    }


    enqueueTest() {
        Meteor.call('testEnqueue', this.state.queueName, this.state.userId, this.state.unicodes, function (err, res) {
            if (err) {
                Alert.error(alertHTML(err), {html: true});
            }

            Alert.success(alertHTML(res), {html: true});
        })
    }

    render() {
        return (
            <div className="test" style={{padding: '20px'}}>
                <h2>입력이 없으면 Default 로 들어갑니다.</h2>
                <TextField
                    onChange={this.onQueueNameChange}
                    hintText="큐 이름을 입력해주세요"
                    floatingLabelText="Queue Name"
                    fullWidth={true}
                />
                <TextField
                    onChange={this.onUserIdChange}
                    hintText="유저 아이디를 입력해주세요"
                    floatingLabelText="User Id"
                    fullWidth={true}
                /><br/>
                <TextField
                    onChange={this.onUnicodesChange}
                    hintText="유니코드들을 띄워쓰기로 구분하여 넣어주세요"
                    floatingLabelText="Unicodes"
                    fullWidth={true}
                /><br/>
                <RaisedButton label="ENQUEUE TEST"
                              onTouchTap={this.enqueueTest}
                              fullWidth={true}/>

                <Alert effect='jelly' stack={{limit: 5}}/>
            </div>
        );
    }
}
