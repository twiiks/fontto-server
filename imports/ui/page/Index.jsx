import React, {Component} from 'react';
import Sticky from 'react-stickynode';

import {Button} from '../component/Button';
import {Header} from "../component/Header";

import '../style/page/Index.scss'

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '0',
            height: '0'
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        let stickyTop;
        if(this.state.width < 768){
            stickyTop = (64 - 36) / 2;
        }else {
            stickyTop = (80 - 36) / 2;
        }

        return (
            <div className='index'>
                <Header rightContents={<Button label='로그인' isRaised={false}/>}/>
                {/*<Button label='test' className='testButton'/>*/}

                <div className='main-picture-wrapper'>
                    <img className='main-picture' src='/image/main-picture.jpg'/>
                    <Sticky className='make-font-button-sticky' enabled={true} top={stickyTop}
                            onStateChange={this.handleStateChange}>
                        <Button className='make-font-button' label='폰트만들기'/>
                    </Sticky>
                    <div className='main-desc'>나만의 폰트를<br/>손쉽게 만들어보세요.</div>
                </div>
            </div>
        );
    }
}
