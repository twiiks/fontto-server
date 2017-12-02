import React, {Component} from 'react';
import {Header} from '../component/Header';
import {Canvas} from '../component/Canvas';
import {Line} from 'rc-progress';
import {Dialog} from "material-ui";
import {Button} from "../component/Button";


import {promise} from "../../api/client/promise";

import '../style/page/Demo_deprecated.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            fonts: '에?훌련된망나니',
            currentIndex: 0,
            contextObj: {},
            defaultLineWidthList: [16, 32, 40],
            mobileLineWidthList: [8, 16, 24],
            currentLineWidth: 12,
            currentLineColor: '#000',
            drawerHighlighter: ['1px solid red', '1px solid black',
                '1px solid black', '1px solid black', '1px solid black', '1px solid black'],
            currentDrawerHighlighter: 0,
            descExists: true,
            progress: 0,
            currentProgressGoal: 0,
            fontsB64Images: {},
            showModal: false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.getContext = this.getContext.bind(this);
        this.onSelectDrawer = this.onSelectDrawer.bind(this);
        this.increaseProgress = this.increaseProgress.bind(this);
        this.onGenerate = this.onGenerate.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentDidMount() {
        document.ontouchmove = function (e) {
            e.preventDefault();
        };
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if (this.state.width < 768) {
            this.setState({
                currentLineWidth: 8
            })
        }
    }

    componentWillUnmount() {
        document.ontouchmove = function (e) {
            return true;
        };
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    renderCanvasList() {
        let canvasList = [];
        let canvasSize = (this.state.width - 90) / 2;
        if (this.state.width >= 768) {
            canvasSize = 340;
        }

        for (let i = 0; i <= this.state.currentIndex; i++) {
            canvasList.push(
                <ReactCSSTransitionGroup
                    key={'canvas-wrapper-' + i}
                    transitionName='up'
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                    transitionAppear={true}
                    transitionAppearTimeout={200}>
                    <div style={{height: canvasSize}}
                         className='canvas-wrapper'>
                        <div className="font" style={{fontSize: canvasSize * 0.9}}>
                            {this.state.fonts[i]}
                        </div>
                        <Canvas id={'canvas-' + this.state.fonts.charCodeAt(i).toString(16)}
                                ref={'canvas-' + this.state.fonts.charCodeAt(i).toString(16)}
                                getContext={this.getContext}
                                image={this.state.contextObj['canvas-' + this.state.fonts.charCodeAt(i).toString(16)]}
                                className='canvas'
                                lineWidth={this.state.currentLineWidth}
                                strokeStyle={this.state.currentLineColor}
                                width={canvasSize}
                                height={canvasSize}/>
                    </div>
                </ReactCSSTransitionGroup>
            )
        }
        return canvasList;
    }

    getContext(canvas, ctx, image) {
        let newContextObj = this.state.contextObj;
        newContextObj[ctx.canvas.id] = image;

        this.setState({
            contextObj: newContextObj
        })
    }

    increaseProgress(goal) {
        let progress = this.state.progress + 1;
        if (progress >= goal || progress >= 100) {
            clearTimeout(this.tm);
            if (progress >= 100) {
                progress = 100;
            }
            this.setState({
                progress
            });
            return;
        }
        this.setState({progress});
        this.tm = setTimeout(this.increaseProgress, 20, goal);
    }

    onNext() {
        if (this.state.currentIndex === this.state.fonts.length - 1) {
            return;
        }
        this.setState({
            animation: 'up',
            descExists: false,
            currentIndex: this.state.currentIndex + 1,
        });
        this.increaseProgress((this.state.currentIndex + 1) / (this.state.fonts.length - 1) * 100);
    }

    onPrev() {
        if (this.state.currentIndex === 0) {
            return;
        } else if (this.state.currentIndex === 1) {
            this.setState({
                descExists: true
            });
        }

        this.setState({
            animation: 'down',
            currentIndex: this.state.currentIndex - 1,
        });
    }

    onSelectDrawer(index, lineWidth, lineColor) {
        let drawerHighlighter = this.state.drawerHighlighter;
        drawerHighlighter[this.state.currentDrawerHighlighter] = '1px solid black';
        drawerHighlighter[index] = '1px solid red';

        this.setState({
            currentLineColor: lineColor,
            currentLineWidth: lineWidth,
            currentDrawerHighlighter: index,
            drawerHighlighter: drawerHighlighter
        })
    }

    onGenerate() {

        let newFontsB64Images = this.state.fontsB64Images;
        let unicodes = [];
        for (let i in this.state.fonts) {
            let unicode = this.state.fonts.charCodeAt(i).toString(16);
            unicodes.push(unicode.toUpperCase());
            let ref = 'canvas-' + unicode;
            newFontsB64Images[unicode] = this.refs[ref].getCanvasBuffer();
        }


        promise('uploadHandwritesToS3', [this.state.fontsB64Images])
            .then()
            .then(Meteor.call('updateUserCount'))
            .then(Meteor.call('getUserEmailById'))
            .then(Meteor.call('enqueue', unicodes))

            .then(function () {
                this.setState({showModal: true});
            }.bind(this))
            .catch((error) => {
                console.log(error)
            })
    }

    onConfirm() {
        this.props.history.push({
            pathname: '/',
            state: {}
        });
    }

    render() {
        let lineWidthList = this.state.mobileLineWidthList;
        if (this.state.width >= 768) {
            lineWidthList = this.state.defaultLineWidthList;
        }

        return (
            <div className='demo'>
                <Header history={this.props.history}
                        rightLongContents={
                            <div style={{marginRight: 8}}>체험해보기</div>
                        }/>

                {this.state.descExists ?
                    <ReactCSSTransitionGroup
                        transitionName='fade'
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                        transitionAppear={true}
                        transitionAppearTimeout={500}>
                        <div className='demo-desc-wrapper'>
                            <div className='demo-desc-title'>
                                시작하기 전 필독해주세요 :)
                            </div>
                            <div className='demo-desc-contents'>
                                0. fontto 는 실제 글자를 반영하기 위해 <b>터치펜</b>을 권장힙니다!<br/>
                                1. 아래의 오른쪽 <b>네모칸에</b> 왼쪽의 글자를 따라써주세요.<br/>
                                2. 오른쪽 아래의 동그라미로 <b>굵기 및 지우개</b>를 사용하실 수 있습니다.<br/>
                                3. 글자를 작성하고 <b>'다음'</b>을 누르면, 다음 글자를 작성하실 수 있습니다.<br/>
                                4. 이전 글자를 다시쓰고 싶으면, 언제든 <b>'이전'</b>을 눌러주세요.<br/>
                                5. 아래의 <b>프로그레스 바</b>에서 진행상태를 확인해주세요.<br/>
                                6. 데모에서는 전체 2,350 글자의 <b>21%</b> 가량을 생성할 수 있어요.<br/>
                                7. 여러분만의 재밌는 글자를 만들어보세요!
                            </div>
                        </div>
                    </ReactCSSTransitionGroup> : null}


                <div className='canvas-list-wrapper'>
                    {this.renderCanvasList()}

                </div>

                <div className='draw-selector'>
                    <div className='draw'
                         onTouchTap={() => this.onSelectDrawer(0, lineWidthList[0], '#000')}>
                        <div className='pen small'
                             style={{border: this.state.drawerHighlighter[0]}}>
                        </div>
                    </div>
                    <div className='draw'
                         onTouchTap={() => this.onSelectDrawer(1, lineWidthList[1], '#000')}>
                        <div className='pen mid'
                             style={{border: this.state.drawerHighlighter[1]}}>
                        </div>
                    </div>
                    <div className='draw'
                         onTouchTap={() => this.onSelectDrawer(2, lineWidthList[2], '#000')}>
                        <div className='pen big'
                             style={{border: this.state.drawerHighlighter[2]}}>
                        </div>
                    </div>
                    <div className='draw'
                         onTouchTap={() => this.onSelectDrawer(3, lineWidthList[2], '#fff')}>
                        <div className='eraser big'
                             style={{border: this.state.drawerHighlighter[3]}}>
                        </div>
                    </div>
                    <div className='draw'
                         onTouchTap={() => this.onSelectDrawer(4, lineWidthList[1], '#fff')}>
                        <div className='eraser mid'
                             style={{border: this.state.drawerHighlighter[4]}}>
                        </div>
                    </div>
                    <div className='draw'
                         onTouchTap={() => this.onSelectDrawer(5, lineWidthList[0], '#fff')}>
                        <div className='eraser small'
                             style={{border: this.state.drawerHighlighter[5]}}>
                        </div>
                    </div>
                </div>

                <div className='bottom-wrapper'>
                    <div className='pre-button' onTouchTap={this.onPrev}>
                        <div className='button-contents'>＜ 이전</div>
                    </div>
                    <div className='progress'>
                        {this.state.progress !== 100 || this.state.currentIndex !== this.state.fonts.length - 1 ?
                            <div className='desc'>데모 폰트 생성 {this.state.progress}%</div>
                            :
                            <div className='desc complete' onTouchTap={this.onGenerate}>클릭하여 폰트 생성하기</div>
                        }

                        <Line percent={this.state.progress}
                              strokeLinecap='square'
                              strokeColor='#44bc40'
                              trailWidth='0'
                              style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: 5
                              }}/>
                    </div>
                    <div className='next-button' onTouchTap={this.onNext}>
                        <div className='button-contents'>다음 ＞</div>
                    </div>
                </div>

                <Dialog
                    actions={
                        <Button
                            className='confirm-modal-button'
                            label="완료하기"
                            primary={true}
                            fullWidth={true}
                            backgroundColor='#fdfdfd'
                            labelColor='#333'
                            onTouchTap={this.onConfirm}
                        />
                    }
                    modal={true}
                    open={this.state.showModal}
                    contentStyle={{width: '80%'}}
                    autoDetectWindowHeight={false}
                >
                    <div className='confirm-modal-head'>
                        <div className='title'>
                            데모
                        </div>
                        <div className='desc'>
                            데모가 완료되었습니다!
                        </div>
                    </div>
                    <br/><br/><br/>
                    <div>작성하신 글자는 '{this.state.fonts}' 입니다.</div>
                    <br/>
                    <div className="confirm-desc">필체를 분석하여 글자를 만들어내는 데 약 2분이 소요됩니다.
                        완료되는데로 회원가입 할 때 작성했던 메일로 보내드리겠습니다!
                        fontto 에 관심을 가져주셔서 감사합니다. :)
                    </div>
                </Dialog>
            </div>
        );
    }
}
