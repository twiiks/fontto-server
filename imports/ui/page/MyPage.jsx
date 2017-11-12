import React, {Component} from 'react';
import {Button} from '../component/Button';
import {Header} from '../component/Header';
import {promise} from "../../api/client/promise";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

import '../style/page/MyPage.scss'


export class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            userEmail: '',
            isUserLoggedIn: true
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        promise('getUserEmailById', [Meteor.userId()])
            .then(res => this.setState({userEmail: res}))
            .catch(err => this.setState({isUserLoggedIn: false}))

    }

    componentWillUpdate() {
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    onLogout(){
        Meteor.logout();
        location.href = '/';
    }

    render() {

        if (!this.state.isUserLoggedIn) {
            alert('로그인 후 접근해주세요!!!');
            this.props.history.push({
                pathname: '/',
                state: {}
            });
        }

        return (
            <div className='mypage'>
                <Header history={this.props.history}
                        rightLongContents={
                            <div>
                                <span className='user-email'>{this.state.userEmail}</span>
                                <Button label='로그아웃' isRaised={false} onTouchTap={this.onLogout}/>
                            </div>

                        }/>
                <Alert effect='jelly' stack={{limit: 3}}/>
            </div>
        );
    }
}
