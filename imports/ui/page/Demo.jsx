import React, {Component} from 'react';
import {Header} from '../component/Header';
import {Canvas} from '../component/Canvas';

import {promise} from "../../api/client/promise";

import '../style/page/Demo.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width: 0,
            fonts: '끓는라면영원히끊을꺼라믿었던나의젊음돌아보니후회뿐모자를잃어버린환자의붉은눈을봤다' +
            '엄마의된장찌개가있는지확인하란소리를듣게됐다아직저는삼학년일뿐인걸요음료를먹고싶으면차가운걸로먹으십시오',
            currentIndex: 0,
            contextObj: {},
            canvasLineWidth: 16,
            canvasStrokeStyle: '#000',
            drawKind: [1, 1, 0.3, 0.3, 0.3],
            koreanUnicodeObj: {}
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getContext = this.getContext.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
        this.onNext = this.onNext.bind(this);
        this.changeLineWidth = this.changeLineWidth.bind(this);
        this.changeToEraser = this.changeToEraser.bind(this);
        this.drawMatrix = this.drawMatrix.bind(this);
        this.drawFonts = this.drawFonts.bind(this);
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

    changeLineWidth(size) {
        let tempDrawKind = [1, 0.3, 0.3, 0.3, 0.3];
        if (size === 38) {
            tempDrawKind[1] = 1;
        } else if (size === 24) {
            tempDrawKind[2] = 1;
        } else if (size === 16) {
            tempDrawKind[3] = 1;
        }
        this.setState({
            drawKind: tempDrawKind,
            canvasLineWidth: size,
            canvasStrokeStyle: '#000'
        })
    }

    changeToEraser() {
        let tempDrawKind = [0.3, 0.3, 0.3, 0.3, 1];
        this.setState({
            drawKind: tempDrawKind,
            canvasStrokeStyle: '#fff'
        })
    }


    onNext() {
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

    drawFonts() {
        let fonts = this.state.fonts;
        let spanFonts = [];
        for (let i = this.state.currentIndex; i < this.state.currentIndex + 35; i++) {
            let color = '#ddd';
            if (i === this.state.currentIndex) color = '#111';
            if (this.state.fonts.length < i) continue;
            spanFonts.push(
                <span key={'font' + i} style={{color: color}}>{fonts[i]}</span>
            )
        }

        return spanFonts
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
                        {this.drawFonts()}
                    </div>
                    <div className='handwrite-wrapper'>
                        <ReactCSSTransitionGroup
                            transitionName='left'
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                            transitionAppearTimeout={300}>
                            <div key={this.state.currentIndex} className='font-info-wrapper'>
                                <div className='font-info' style={{fontSize: fontSize}}>
                                    {this.state.fonts[this.state.currentIndex]}
                                </div>
                            </div>
                        </ReactCSSTransitionGroup>
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
                                                    <img style={{opacity: this.state.drawKind[0]}}
                                                         src='/image/ico-pencil.png'/>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeLineWidth(38)}>
                                                <div style={{opacity: this.state.drawKind[1]}}
                                                    className='config pencil big'>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeLineWidth(24)}>
                                                <div style={{opacity: this.state.drawKind[2]}}
                                                    className='config pencil mid'>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeLineWidth(16)}>
                                                <div style={{opacity: this.state.drawKind[3]}}
                                                     className='config pencil small'>
                                                </div>
                                            </div>
                                            <div className='config-wrapper'
                                                 onTouchTap={() => this.changeToEraser()}>
                                                <div className='config eraser'>
                                                    <img style={{opacity: this.state.drawKind[4]}}
                                                        src='/image/ico-eraser.png'/>
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
                                2,350 자 중 <b>112</b> 자 생성가능
                            </div>
                            <div className='accuracy'>
                                필체 유사도 : <b>12</b> %
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
