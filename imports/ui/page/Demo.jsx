import React, {Component} from 'react';
import {Header} from '../component/Header';
import {Canvas} from '../component/Canvas';

import {promise} from "../../api/client/promise";

import '../style/page/Demo.scss';

export class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width: 0,
            fonts: '영원히끓을거라믿었던나의젊음돌아봤더니후회뿐',
            currentIndex: 0,
            contextObj: {},
            canvasLineWidth: 5
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getContext = this.getContext.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
    }

    componentDidMount() {
        document.ontouchmove = function (e) {
            e.preventDefault();
        };
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        document.ontouchmove = function (e) {
            return true;
        };
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }


    getContext(canvas, ctx, image) {
        let newContextObj = this.state.contextObj;
        newContextObj[ctx.canvas.id] = image;

        this.setState({
            contextObj: newContextObj
        })
    }

    getCanvas(index) {
        const canvasId = 'canvas-' + this.getUnicode(index);
        let canvasSize = 343.6;
        if (this.state.width) {
            if (this.state.width < 768)
                canvasSize = this.state.width / 2 - 2
        }
        return (
            <Canvas getContext={this.getContext}
                    id={canvasId}
                    width={canvasSize}
                    height={canvasSize}
                    lineWidth={this.state.canvasLineWidth}>
            </Canvas>
        )
    }

    makeButtonConfig() {

    }

    getUnicode(index) {
        return this.state.fonts.charCodeAt(index).toString(16).toUpperCase();
    }


    render() {
        let fontSize = 384;
        if (this.state.width < 768) {
            fontSize = this.state.width / 2;
        }

        return (
            <div className='demo'>
                <Header history={this.props.history}
                        rightLongContents={
                            <div style={{marginRight: 8}}>체험해보기</div>
                        }/>
                <div className='demo-body' style={{height: this.state.height - 80}}>
                    <div className='fonts'>
                        {this.state.fonts}
                    </div>
                    <div className='handwrite-wrapper'>
                        <div className='font-info-wrapper'>
                            <div className='font-info' style={{fontSize: fontSize}}>
                                {this.state.fonts[this.state.currentIndex]}
                            </div>
                        </div>
                        <div className='canvas-all-wrapper'>
                            <div className='canvas-all'>
                                <div className='canvas-wrapper'>
                                    {this.getCanvas(0)}
                                </div>
                                <div className='write-info'>
                                    <div className='write-config'>

                                    </div>
                                    <div className='write-button-wrapper'>
                                        <div className='prev-button'>
                                            ＜ 이전
                                        </div>
                                        <div className='next-button'>
                                            다음 ＞
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='informations'>
                        <div className='text-infos'>
                            <div className='can-info'>

                            </div>
                            <div className='accuracy'>

                            </div>
                        </div>
                        <div className='matrix-wrapper'>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
