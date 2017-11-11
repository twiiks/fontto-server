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
        this.setState({width: window.innerWidth, height: window.innerHeight});
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
                <Header rightContents={<Button label='로그인' isRaised={false}/>}/>
                {/*<Button label='test' className='testButton'/>*/}

                <div className='section-1'>
                    <img className='main-picture' src='/image/main-picture.jpg'/>
                    <Sticky className='make-font-button-sticky' enabled={true} top={stickyTop}>
                        <Button className='make-font-button' label='폰트만들기'/>
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
            </div>
        );
    }
}
