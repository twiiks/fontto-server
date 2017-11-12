import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Button} from "./Button";

import '../style/component/SignUpModal.scss'

export class SignUpModal extends Component {
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
                <div className='signup-modal-head'>
                    <div className='title'>
                        회원가입
                    </div>
                    <div className='desc'>
                        fontto 의 일원이 되세요!
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
                <TextField
                    style={{marginTop: -20}}
                    floatingLabelFocusStyle={{color: '#999'}}
                    underlineFocusStyle={{borderColor: '#999'}}
                    floatingLabelText='confirm password'
                    hintText="패스워드를 다시한번 확인해주세요."
                    fullWidth={true}
                    type='password'
                />

                <br/>
                <br/>
                <Button
                    className='signup-modal-button'
                    label="회원가입"
                    primary={true}
                    fullWidth={true}
                />
                <Button
                    className='signup-modal-button'
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
