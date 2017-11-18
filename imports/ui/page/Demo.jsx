import React, {Component} from 'react';
import {Header} from '../component/Header';
import {Canvas} from '../component/Canvas';

import '../style/page/Demo.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            fonts: '가나다라마바사아자차카',
            currentIndex: 0,
            contextDic: {},
            defaultLineWidthList: [16, 32, 40],
            mobileLineWidthList: [8, 16, 24],
            currentLineWidth: 12,
            currentLineColor: '#000',
            drawerHighlighter: ['1px solid red', '1px solid black',
                '1px solid black', '1px solid black', '1px solid black', '1px solid black'],
            currentDrawerHighlighter: 0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.getContext = this.getContext.bind(this);
        this.onSelectDrawer = this.onSelectDrawer.bind(this);
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
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={100}
                    transitionAppear={true}
                    transitionAppearTimeout={100}>
                    <div style={{height: canvasSize}}
                         className='canvas-wrapper'>
                        <div className="font" style={{fontSize: canvasSize * 0.9}}>
                            {this.state.fonts[i]}
                        </div>
                        <Canvas id={'canvas-' + this.state.fonts[i]}
                                getContext={this.getContext}
                                image={this.state.contextDic['canvas-' + this.state.fonts[i]]}
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

    getContext(ctx, image) {
        let newContextDic = this.state.contextDic;
        newContextDic[ctx.canvas.id] = image;

        this.setState({
            contextDic: newContextDic
        })
    }

    onNext() {
        if (this.state.currentIndex === this.state.fonts.length - 1) {
            return;
        }
        this.setState({
            animation: 'up',
            currentIndex: this.state.currentIndex + 1
        })
    }

    onPrev() {
        if (this.state.currentIndex === 0) {
            return;
        }

        this.setState({
            animation: 'down',
            currentIndex: this.state.currentIndex + -1
        })
    }

    onSelectDrawer(index, lineWidth, lineColor) {
        let drawerHighlighter = this.state.drawerHighlighter;
        drawerHighlighter[this.state.currentDrawerHighlighter] = '1px solid black';
        drawerHighlighter[index] = '1px solid red';
        this.setState({

        });

        this.setState({
            currentLineColor: lineColor,
            currentLineWidth: lineWidth,
            currentDrawerHighlighter: index,
            drawerHighlighter: drawerHighlighter
        })
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
                    <div className='pre-button' onTouchTap={this.onPrev}></div>
                    <div className='progress'></div>
                    <div className='next-button' onTouchTap={this.onNext}></div>
                </div>
            </div>
        );
    }
}
