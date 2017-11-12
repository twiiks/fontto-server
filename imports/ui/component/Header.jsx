import React, {Component} from 'react';

import '../style/component/Header.scss'

export class Header extends Component {
    constructor(props) {
        super(props);
        this.onHome = this.onHome.bind(this)
    }

    onHome(){
        this.props.history.push({
            pathname: '/',
            state: {}
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='wrapper'>
                    <img className='logo' src='/image/logo.png' onClick={this.onHome}/>

                    <div className='right-contents-wrapper'>
                        <div className='contents'>
                            {this.props.rightContents}
                        </div>
                    </div>
                    <div className='right-contents-long-wrapper'>
                        <div className='contents'>
                            {this.props.rightLongContents}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
