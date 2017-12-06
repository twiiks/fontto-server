import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import {Header} from '../component/Header';
import {Canvas} from '../component/Canvas';

import {promise} from "../../api/client/promise";

import '../style/page/Demo.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Dialog, TextField} from "material-ui";
import {Button} from "../component/Button";


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
            canvasLineWidth: 24,
            canvasStrokeStyle: '#000',
            drawKind: [1, 0.3, 1, 0.3, 0.3],
            koreanUnicodeObj: {},
            b64Images: {},
            canWriteCount: 0,
            increasingCanWriteCount: 0,
            accuracy: 0,
            increasingAccuracy: 0.0,
            demoEndAlert: false,
            showFloatingEndBtn: false,
            showLoading: false,
            showResult: false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getContext = this.getContext.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
        this.onNext = this.onNext.bind(this);
        this.changeLineWidth = this.changeLineWidth.bind(this);
        this.changeToEraser = this.changeToEraser.bind(this);
        this.drawMatrix = this.drawMatrix.bind(this);
        this.drawFonts = this.drawFonts.bind(this);
        this.increaseCanWriteCount = this.increaseCanWriteCount.bind(this);
        this.setAccuracy = this.setAccuracy.bind(this);
        this.increaseAccuracy = this.increaseAccuracy.bind(this);
        this.goOnDemo = this.goOnDemo.bind(this);
        this.finishDemo = this.finishDemo.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    componentDidMount() {
        document.ontouchmove = function (e) {
            e.preventDefault();
        };
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        let koreanUnicodes = require('../../../public/constants/korean-unicodes.json');
        let koreanUnicodesObj = {};
        let visibleList = [];
        for (let i = 0; i < 2000; i++) {
            koreanUnicodesObj[koreanUnicodes.kr[i]] = i;
            visibleList[i] = 0;
        }
        this.setState({
            koreanUnicodeObj: koreanUnicodesObj,
            visibleList: visibleList
        })
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
            canvasLineWidth: 24,
            canvasStrokeStyle: '#fff'
        })
    }

    setAccuracy(canWriteCount) {
        let tempRatio = Math.log(canWriteCount) / Math.log(2350);
        tempRatio *= 100;
        this.setState({accuracy: tempRatio.toFixed(3)});
        return tempRatio.toFixed(3);
    }

    increaseCanWriteCount(goal) {
        let progress = this.state.increasingCanWriteCount + 1;
        if (progress >= goal) {
            clearTimeout(this.tm);
            return;
        }
        this.setState({increasingCanWriteCount: progress});
        this.tm = setTimeout(this.increaseCanWriteCount, 10, goal);
    }

    increaseAccuracy(goal) {
        let random = Math.random();
        let progress = parseFloat(this.state.increasingAccuracy) +
            parseFloat(random);
        progress = progress.toFixed(3);
        if (parseFloat(progress) >= parseFloat(goal)) {
            clearTimeout(this.tm2);
            return;
        }
        this.setState({increasingAccuracy: progress});
        this.tm2 = setTimeout(this.increaseAccuracy, 10, goal);
    }

    onNext() {
        if (this.state.currentIndex === 3) {
            this.setState({
                demoEndAlert: true
            })
        }
        let tempVisibleList = this.state.visibleList;
        let tempCanWriteCount = this.state.canWriteCount;
        for (let i = 0; i < 36; i++) {
            let index = Math.floor(Math.random() * 2000);
            if (tempVisibleList[index] !== 1) tempCanWriteCount++;
            tempVisibleList[index] = 1;
        }
        let tempAccuracy = this.setAccuracy(tempCanWriteCount);

        this.tm = setTimeout(this.increaseCanWriteCount, 10, tempCanWriteCount);
        this.tm2 = setTimeout(this.increaseAccuracy, 10, tempAccuracy);

        tempVisibleList[this.state.koreanUnicodeObj[this.state.fonts[this.state.currentIndex]]] = 1;

        let tempB64Images = this.state.b64Images;
        tempB64Images[this.getUnicode(this.state.currentIndex)] =
            this.refs['canvas-' + this.getUnicode(this.state.currentIndex)].getCanvasBuffer();

        this.setState({
            currentIndex: this.state.currentIndex + 1,
            visibleList: tempVisibleList,
            canWriteCount: tempCanWriteCount,
            b64Images: tempB64Images
        })
    }

    getUnicode(index) {
        return this.state.fonts.charCodeAt(index).toString(16).toUpperCase();
    }

    drawMatrix() {
        let matrix = [];
        let koreanUnicodes = require('../../../public/constants/korean-unicodes.json');
        for (let i = 0; i < 2000; i++) {
            let visibility;
            if (!this.state.visibleList) {
                visibility = 'hidden';
            } else if (this.state.visibleList[i] === 1) {
                visibility = 'visible';
            } else {
                visibility = 'hidden';
            }

            matrix.push(
                <div
                    key={i}
                    ref={'cell-' + i}
                    style={{
                        visibility: visibility,
                        height: '1em',
                        width: '1em',
                        float: 'left',
                        padding: 1,
                        fontSize: '0.1em',
                        fontFamily: 'Nanum Gothic'
                    }}>{koreanUnicodes.kr[i]}
                </div>
            )
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

    goOnDemo() {
        this.setState({
            demoEndAlert: false,
            showFloatingEndBtn: true,
        })
    }

    // 데모 끝
    finishDemo() {
        this.setState({
            demoEndAlert: false,
            showLoading: true
        });

        let unicodes = [];
        for (let i = 0; i < 4; i++) {
            let unicode = this.state.fonts.charCodeAt(i).toString(16);
            unicodes.push(unicode.toUpperCase());
        }

        // S3 에 이미지들 업로드
        // response 받기
        promise('uploadHandwritesToS3', [this.state.b64Images])
            .then(Meteor.call('updateUserCount'))
            .then((res) => {
                if (res.result === 'ok') {
                    Meteor.call('requestGenerate', unicodes, function (err, res) {
                        console.log(res);

                        let newStyle = document.createElement('style');
                        newStyle.appendChild(document.createTextNode("\
                            @font-face {\
                                font-family: temp;\
                                src: url(" + res.woff + ");\
                            }\
                            "));
                        document.head.appendChild(newStyle);

                        this.setState({
                            showResult: true
                        })
                    }.bind(this))
                }
            })

    }

    goHome() {
        this.props.history.push({
            pathname: '/',
            state: {}
        });
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
                                2,350 자 중 <b>{this.state.increasingCanWriteCount}</b> 자 생성가능
                            </div>
                            <div className='accuracy'>
                                필체 유사도 : <b>{this.state.increasingAccuracy}</b> %
                            </div>
                        </div>
                        <div className='matrix-wrapper'>
                            {this.drawMatrix()}
                        </div>
                    </div>
                </div>

                <Dialog
                    modal={true}
                    open={this.state.demoEndAlert}
                    contentStyle={{width: '80%'}}
                    autoDetectWindowHeight={false}>
                    <div className='confirm-modal-head'>
                        <div className='title'>
                            더 써보기
                        </div>
                        <div className='desc'>
                            더 써보시겠어요?
                        </div>
                    </div>
                    <br/><br/><br/>
                    <div className="confirm-desc">
                        데모는 여기까지 쓰셨던 글자로 폰트를 만들어냅니다. 계속 쓰실 수는 있지만,
                        이후에 쓰는 글자들은 학습에 반영되지 않습니다.
                    </div>
                    <br/>
                    <Button
                        className='confirm-modal-button'
                        label="계속 써볼래요!"
                        primary={true}
                        fullWidth={true}
                        backgroundColor='#fdfdfd'
                        labelColor='#333'
                        onTouchTap={this.goOnDemo}
                    />
                    <div style={{height: 5}}></div>
                    <Button
                        className='confirm-modal-button'
                        label="끝내고 결과를 보고싶어요!"
                        fullWidth={true}
                        backgroundColor='#333'
                        labelColor='#fdfdfd'
                        onTouchTap={this.finishDemo}
                    />
                </Dialog>

                {this.state.showLoading ?
                    <div className='dim-wrapper'>
                        <ReactLoading className='loading'/>
                        <div className='loading-desc-1'>
                            폰트 생성중입니다...
                        </div>
                        <div className='loading-desc-2'>
                            ( 2~3 분 소요됩니다. )
                        </div>
                    </div>
                    : null}

                {this.state.showFloatingEndBtn ?
                    <div className='floating-end-button'
                         onTouchTap={this.finishDemo}>
                        <div className='text'>
                            끝내기
                        </div>
                    </div>
                    : null}


                <Dialog
                    modal={true}
                    open={this.state.showResult}
                    contentStyle={{width: '80%'}}
                    autoDetectWindowHeight={false}>
                    <div className='confirm-modal-head'>
                        <div className='title'>
                            데모 결과
                        </div>
                        <div className='desc'>
                            데모가 완료되었습니다! 결과를 확인해보세요.
                        </div>
                    </div>
                    <br/><br/><br/>
                    <div className="confirm-desc">
                        데모에서는 약 20여자를 작성하실 수 있습니다. 힌트에 따라 글자를 작성해보세요!
                    </div>
                    {/*<TextField*/}
                    {/*hintText="감사합니다 열정끓는 세 청년이 다음달 런칭합니다."*/}
                    {/*floatingLabelText="감사합니다 열정끓는 세 청년이 다음달 런칭합니다."*/}
                    {/*floatingLabelFocusStyle={{color: '#999'}}*/}
                    {/*underlineFocusStyle={{borderColor: '#999'}}*/}
                    {/*style={{margin: '0 5%', width: '90%', height: '2em'}}*/}
                    {/*inputStyle={{fontFamily: 'temp', fontSize: '2em'}}*/}
                    {/*/>*/}
                    <div className='hint'>
                        감사합니다 열정끓는 세 청년이 다음달 런칭합니다.
                    </div>

                    <input type='text'
                           height='2em'
                           style={{
                               fontSize: '2em',
                               margin: '1% 3%',
                               width: '94%',
                               outline: 'none',
                               borderLeft: '0',
                               borderTop: '0',
                               borderRight: '0',
                               fontFamily: 'temp'
                           }}
                    ></input>

                    <br/>

                    <div className="take-a-look">
                        {/*다른 유저들이 만든 글자를 구경해보세요!*/}
                    </div>
                    <br/>
                    <Button
                        className='confirm-modal-button'
                        label="첫 화면으로 돌아가기"
                        fullWidth={true}
                        backgroundColor='#333'
                        labelColor='#fdfdfd'
                        onTouchTap={this.goHome}
                    />
                </Dialog>
            </div>

        );
    }
}
