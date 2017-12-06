import React, {Component} from 'react';
import {Button} from '../component/Button';
import {Header} from '../component/Header';
import {promise} from "../../api/client/promise";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

import '../style/page/MyPage.scss'
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle, FlatButton} from "material-ui";


export class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            userEmail: '',
            isUserLoggedIn: true,
            copyText: `
    <style>
        @font-face {
        font-family: 'fontto';
        src: url(https://s3.ap-northeast-2.amazonaws.com/fontto/example/UhBeeKang-Ja.woff);
        }
    </style>
    <h1 style="font-family: 'fontto';">여기에 글을 작성하세요!</h1>`
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onWoff = this.onWoff.bind(this);
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

    onLogout() {
        Meteor.logout();
        location.href = '/';
    }

    onWoff() {
        let copyText = document.querySelector('#copy');
        copyText.select();
        document.execCommand("copy");
        Alert.success('태그가 복사되었어요!<br/> 붙여넣어 사용하세요 :)',
            {position: 'bottom-right', html: true});
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
                <div className='mypage-content'>
                    <div className='myfont'>내 폰트</div>

                    <div className='font-card'>
                        <div className='font-title'>
                            폰토체
                        </div>
                        <div className='font-delete'>
                            ×
                        </div>
                        <div className='divider'></div>
                        <div className='font-desc'>
                            폰토가 만든 첫번째 폰트! 폰토체입니다. :)
                        </div>

                        <div className='buttons-wrapper'>
                            <div className='woff-button'
                                 onTouchTap={() => this.onWoff()}>
                                CSS 태그 복사하기
                            </div>
                            <div className='ttf-button'>
                                TTF 다운받기
                            </div>
                        </div>
                    </div>

                    <div className='font-card'>
                        <div className='font-title'>
                            준영체
                        </div>
                        <div className='font-delete'>
                            ×
                        </div>
                        <div className='divider'></div>
                        <div className='font-desc'>
                            한글자한글자 정성을 다해 만들었습니다.
                        </div>

                        <div className='buttons-wrapper'>
                            <div className='woff-button'>
                                CSS 태그 복사하기
                            </div>
                            <div className='ttf-button'>
                                TTF 다운받기
                            </div>
                        </div>

                        <div
                            style={{position: 'fixed', left: -1000}}
                        >
                            <textarea id='copy'
                                      defaultValue={this.state.copyText}/>
                        </div>
                    </div>
                </div>
                <Alert effect='jelly' stack={{limit: 3}}/>
            </div>
        );
    }
}
