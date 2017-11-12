import React, {Component} from 'react';
import Sticky from 'react-stickynode';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

import {Button} from '../component/Button';
import {Header} from '../component/Header';
import {Footer} from '../component/Footer';
import {LoginModal} from '../component/LoginModal';
import {SignUpModal} from "../component/SignUpModal";

import '../style/page/Index.scss'

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '0',
            height: '0',
            loginModalOpen: false,
            signUpModalOpen: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.onLoginOpen = this.onLoginOpen.bind(this);
        this.onLoginCancel = this.onLoginCancel.bind(this);
        this.onLogin = this.onLogin.bind(this);

        this.onSignUpOpen = this.onSignUpOpen.bind(this);
        this.onSignUpCancel = this.onSignUpCancel.bind(this);
        this.onSignUp = this.onSignUp.bind(this);

        this.onMakeFont = this.onMakeFont.bind(this);

        this.onMyPage = this.onMyPage.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    onLoginOpen() {
        document.body.style.position = "fixed";
        this.setState({
            loginModalOpen: true
        })
    }

    onSignUpOpen() {
        document.body.style.position = "fixed";
        this.setState({
            loginModalOpen: false,
            signUpModalOpen: true
        })
    }

    onSignUpCancel() {
        document.body.style.position = "";
        this.setState({
            signUpModalOpen: false
        })
    }

    onLoginCancel() {
        document.body.style.position = "";
        this.setState({
            loginModalOpen: false
        })
    }

    onLogin(res) {
        if (res === 'NOT_MATCHED')
            Alert.error('일치하는 이메일이 없습니다!', {position: 'bottom-right'});
        else if (res === 'INVALID_PASSWORD')
            Alert.error('비밀번호가 일치하지 않습니다!', {position: 'bottom-right'});
        else if (res === 'SUCCEED')
            Alert.success('환영합니다 :)', {position: 'bottom-right'});

        this.setState({
            loginModalOpen: false
        })
    }

    onSignUp(res) {
        if (res.result === 'error') {
            switch (res.code) {
                case 'NOT_MATCHED':
                    Alert.error('두 비밀번호가 일치하지 않습니다!', {position: 'bottom-right'});
                    break;
                case 'LENGTH_SHORT':
                    Alert.error('6자리 이상의 비밀번호를 입력해주세요!', {position: 'bottom-right'});
                    break;
                case 'EMAIL_NOT_VALID':
                    Alert.error('이메일 형식이 적절하지 않습니다!', {position: 'bottom-right'});
                    break;
                case 'USER_EXIST':
                    Alert.error('같은 메일의 유저가 이 존재합니다!', {position: 'bottom-right'});
                    break;
            }
        } else {
            Alert.success('회원가입이 완료되었습니다! <br/> 이제 로그인해주세요!', {html: true});
            this.setState({
                signUpModalOpen: false,
                loginModalOpen: true
            })
        }

    }

    onMakeFont() {
        if (Meteor.userId()) {
            this.props.history.push({pathname: '/make-font'});
        } else {
            this.setState({
                loginModalOpen: true
            })
        }
    }

    onMyPage() {
        this.props.history.push({pathname: '/mypage'});
    }

    render() {

        let stickyTop;
        if (this.state.width < 768) {
            stickyTop = (64 - 36) / 2;
        } else {
            stickyTop = (80 - 36) / 2;
        }

        return (
            <div className='index'>
                <Header history={this.props.history}
                        rightContents={
                            Meteor.userId() ?
                                <Button label='내 정보' isRaised={false} onTouchTap={this.onMyPage}/>
                                :
                                <Button label='로그인' isRaised={false} onTouchTap={this.onLoginOpen}/>
                        }/>
                {/*<Button label='test' className='testButton'/>*/}

                <div className='section-1'>
                    <img className='main-picture' src='/image/main-picture.jpg'/>
                    <Sticky className='make-font-button-sticky' enabled={true} top={stickyTop}>
                        <Button className='make-font-button' label='폰트만들기' onTouchTap={this.onMakeFont}/>
                    </Sticky>
                    <div className='main-desc-1'>나만의 폰트를<br/>손쉽게 만들어보세요.</div>
                </div>

                <div className='section-2'>
                    <img className='desc-background' src='/image/desc-background.jpg'/>
                    <div className='main-desc-2'>fontto는 딥러닝 기반<br/>폰트 제작 서비스입니다.</div>
                    <div className='desc-image-wrapper'>
                        <img className='desc-image' src='/image/desc-image-1.png'/>
                        <img className='desc-image' src='/image/desc-image-2.png'/>
                        <img className='desc-image' src='/image/desc-image-3.png'/>
                    </div>
                </div>

                <div className='section-3'>
                    <div className='main-desc-3'>다른 사람들이 제작한<br/>폰트를 구경해보세요.</div>
                    <div className='example-image-wrapper'>
                        <img className='example-image' src='/image/example-1.png'/>
                        <img className='example-image' src='/image/example-2.png'/>
                        <img className='example-image' src='/image/example-3.png'/>
                    </div>
                    <Sticky className='showcase-button-sticky' enabled={true} top={stickyTop}>
                        <Button className='showcase-button' label='구경하기'/>
                    </Sticky>
                </div>

                <LoginModal isOpen={this.state.loginModalOpen}
                            onCancel={this.onLoginCancel}
                            onLogin={this.onLogin}
                            onSignUpOpen={this.onSignUpOpen}/>
                <SignUpModal isOpen={this.state.signUpModalOpen}
                             onCancel={this.onSignUpCancel}
                             onSignUp={this.onSignUp}/>
                <Footer/>
                <Alert effect='jelly' stack={{limit: 3}}/>
            </div>
        );
    }
}
