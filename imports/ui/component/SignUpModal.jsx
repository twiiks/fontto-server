import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Button} from "./Button";

import {promise} from '../../api/client/promise';

import '../style/component/SignUpModal.scss';


export class SignUpModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: ''
        };
        this.onSignUp = this.onSignUp.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    onChangeConfirmPassword(e) {
        this.setState({
            confirmPassword: e.target.value
        })
    }

    onSignUp() {
        const email = this.state.email;
        const password = this.state.password;
        const confirmPassword = this.state.confirmPassword;

        // 1. password vs confirmPassword
        // 2. 비밀번호 6자리
        // 3. 이메일 형식확인
        // 4. 이메일 중복확인

        promise('checkValidEmail', [email])
            .then(res => promise('checkPasswordLength', [password]))
            .then(res => promise('confirmPassword', [password, confirmPassword]))
            .then(res => promise('resister', [email, password]))
            .then(res => this.props.onSignUp(res))
            .catch(err => this.props.onSignUp(err))
    }

    render() {
        const actions = [
            <Button
                onTouchTap={this.onSignUp}
                className='signup-modal-button'
                label="회원가입"
                primary={true}
                fullWidth={true}
            />,
            <Button
                className='signup-modal-button'
                label="취소"
                primary={true}
                fullWidth={true}
                backgroundColor='#fdfdfd'
                labelColor='#333'
                onTouchTap={this.props.onCancel}
            />
        ];
        return (
            <Dialog
                actions={actions}
                modal={true}
                open={this.props.isOpen}
                contentStyle={{width: '300px'}}
                autoDetectWindowHeight={false}
            >
                <div className='signup-modal-head'>
                    <div className='title'>
                        회원가입
                    </div>
                    <div className='desc'>
                        fontto 의 회원이 되어주세요!
                    </div>
                </div>
                <br/>
                <TextField
                    onChange={this.onChangeEmail}
                    floatingLabelText='email'
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    hintText="fontto@twiiks.co"
                    fullWidth={true}
                />
                <TextField
                    onChange={this.onChangePassword}
                    style={{marginTop: -20}}
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    floatingLabelText='password'
                    hintText="패스워드를 입력하세요."
                    fullWidth={true}
                    type='password'
                />
                <TextField
                    onChange={this.onChangeConfirmPassword}
                    style={{marginTop: -20}}
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    floatingLabelText='confirm password'
                    hintText="패스워드를 확인해주세요."
                    fullWidth={true}
                    type='password'
                />

            </Dialog>
        );
    }
}
