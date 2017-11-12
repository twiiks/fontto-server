import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Button} from "./Button";

import '../style/component/LoginModal.scss'

export class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onEmailChange(e){
        this.setState({
            email: e.target.value
        })
    }

    onPasswordChange(e){
        this.setState({
            password: e.target.value
        })
    }

    onLogin(e){
        const email = this.state.email;
        const password = this.state.password;
        console.log(email, password);

        // TODO
        // 로그인
        // 이메일 없음
        // 패스워드 다름
        // 성공시 Index.jsx 로 결과를 넘겨줌

        this.props.onLogin('login');
    }

    render() {
        return (
            <Dialog
                modal={true}
                open={this.props.isOpen}
                contentStyle={{width: '300px'}}
                autoScrollBodyContent={true}
            >
                <div className='login-modal-head'>
                    <div className='title'>
                        로그인
                    </div>
                    <div className='desc'>
                        로그인하여 여러분만의 폰트를 생성하세요!
                    </div>
                </div>
                <br/>
                <TextField
                    onChange={this.onEmailChange}
                    floatingLabelText='email'
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    hintText="fontto@twiiks.co"
                    fullWidth={true}
                />
                <TextField
                    onChange={this.onPasswordChange}
                    style={{marginTop: -20}}
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    floatingLabelText='password'
                    hintText="패스워드를 입력하세요."
                    fullWidth={true}
                    type='password'
                />
                <br/>
                <br/>
                <Button
                    onTouchTap={this.onLogin}
                    className='login-modal-button-top'
                    label="로그인"
                    primary={true}
                    fullWidth={true}
                />
                <div className='sign-up-desc'>회원이 아니세요? 회원가입해보세요!</div>
                <Button
                    className='login-modal-button'
                    label="회원가입"
                    primary={true}
                    fullWidth={true}
                    onTouchTap={this.props.onSignUpOpen}
                />
                <Button
                    className='login-modal-button'
                    label="취소"
                    primary={true}
                    fullWidth={true}
                    backgroundColor='#fdfdfd'
                    labelColor='#333'
                    onTouchTap={this.props.onCancel}
                />
            </Dialog>
        );
    }
}
