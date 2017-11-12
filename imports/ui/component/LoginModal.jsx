import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Button} from "./Button";

import '../style/component/LoginModal.scss'

export class LoginModal extends Component {
    constructor(props) {
        super(props);
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
                    floatingLabelText='email'
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    hintText="fontto@twiiks.co"
                    fullWidth={true}
                />
                <TextField
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
