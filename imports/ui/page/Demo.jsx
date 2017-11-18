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
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
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

    renderCanvasList() {
        let canvasList = [];
        let canvasSize = (this.state.width - 140) / 2;
        if (this.state.width >= 768) {
            canvasSize = 340;
        }

        for (let i = 0; i <= this.state.currentIndex; i++) {
            canvasList.push(
                <ReactCSSTransitionGroup
                    key={'canvas-wrapper-' + i}
                    transitionName='up'
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    transitionAppear={true}
                    transitionAppearTimeout={500}>
                    <div style={{height: canvasSize}}
                         className='canvas-wrapper'>
                        <div className="font" style={{fontSize: canvasSize * 0.9}}>
                            {this.state.fonts[i]}
                        </div>
                        <Canvas id={'canvas' + this.state.fonts[i]} className='canvas'
                                width={canvasSize} height={canvasSize}/>
                    </div>
                </ReactCSSTransitionGroup>
            )
        }
        return canvasList;
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

    render() {
        console.log('render');
        return (
            <div className='demo'>
                <Header history={this.props.history}
                        rightLongContents={
                            <div style={{marginRight: 8}}>체험해보기</div>
                        }/>


                <div className='canvas-list-wrapper'>
                    {this.renderCanvasList()}

                </div>

                <div className='pen-selector'>
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
