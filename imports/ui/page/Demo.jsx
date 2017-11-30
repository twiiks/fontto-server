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
            canvasLineWidth: 16,
            canvasStrokeStyle: '#333',
            koreanUnicodeObj: {}
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getContext = this.getContext.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
        this.onNext = this.onNext.bind(this);
        this.changeLignWidth = this.changeLignWidth.bind(this);
        this.changeToEraser = this.changeToEraser.bind(this);
        this.drawMatrix = this.drawMatrix.bind(this);
    }

    componentDidMount() {
        document.ontouchmove = function (e) {
            e.preventDefault();
        };
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        let koreanUnicodes = require('../../../public/constants/korean-unicodes.json');
        let koreanUnicodesObj = {};
        for (let i = 0; i < 2000; i++) {
            koreanUnicodesObj[koreanUnicodes.kr[i]] = i
        }
        this.setState({koreanUnicodeObj: koreanUnicodesObj})
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


    getContext(ctx, image) {
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
                    ref={canvasId}
                    width={canvasSize}
                    height={canvasSize}
                    contextObj={this.state.contextObj}
                    strokeStyle={this.state.canvasStrokeStyle}
                    lineWidth={this.state.canvasLineWidth}>
            </Canvas>
        )
    }

    makeButtonConfig() {

    }

    changeLignWidth(size) {
        this.setState({
            canvasLineWidth: size,
            canvasStrokeStyle: '#333'
        })
    }

    changeToEraser() {
        this.setState({
            canvasStrokeStyle: '#fff'
        })
    }


    onNext() {
        console.log(this.state.contextObj);
        this.setState({
            currentIndex: this.state.currentIndex + 1
        })
    }

    getUnicode(index) {
        return this.state.fonts.charCodeAt(index).toString(16).toUpperCase();
    }

    drawMatrix() {
        let matrix = [];
        let koreanUnicodes = require('../../../public/constants/korean-unicodes.json');
        for (let i = 0; i < 2000; i++) {
            matrix.push(<div
                key={i}
                ref={'cell-' + i}
                style={{
                    height: '1em',
                    width: '1em',
                    float: 'left',
                    padding: 1,
                    fontSize: '0.1em',
                    fontFamily: 'Nanum Gothic'
                }}>{koreanUnicodes.kr[i]}</div>)
        }
        return matrix;
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
                                    {this.getCanvas(this.state.currentIndex)}
                                </div>
                                <div className='write-info'>
                                    <div className='write-button-wrapper'>
                                        <div className='write-config'>
                                            <div className='config-wrapper'>
                                                <div className='config pencil-ico'>
                                                    <img src='/image/ico-pencil.png'/>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeLignWidth(38)}>
                                                <div className='config pencil big'>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeLignWidth(24)}>
                                                <div className='config pencil mid'>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeLignWidth(16)}>
                                                <div className='config pencil small'>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeToEraser()}>
                                                <div className='config eraser'>
                                                    <img src='/image/ico-eraser.png'/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='next-button' onTouchTap={this.onNext}>
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
                            {this.drawMatrix()}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
