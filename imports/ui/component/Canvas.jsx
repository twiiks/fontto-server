import React, {Component} from 'react';

import '../style/component/Canvas.scss';

export class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDrawing: false,
            lastX: 0,
            lastY: 0,
        };
        this.draw = this.draw.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDrawEnd = this.onDrawEnd.bind(this);
    }

    canvas() {
        const selector = '#' + this.props.id;
        return document.querySelector(selector);
    }

    ctx() {
        this.props.getContext(
            this.canvas().getContext('2d'),
            this.canvas()
        );
        return this.canvas().getContext('2d');
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.id !== this.props.id) {
            this.clearCanvas();
        }
    }

    componentWillUnmount() {
        const canvas = this.canvas();
        const ctx = this.ctx();
    }

    componentDidMount() {
        const canvas = this.canvas();
        const ctx = this.ctx();
    }

    onMouseDown(e) {
        this.setState({
            isDrawing: true,
            lastX: e.nativeEvent.offsetX,
            lastY: e.nativeEvent.offsetY
        })
    }

    onDrawEnd(e) {
        this.setState({isDrawing: false});
    }

    draw(e) {
        this.ctx().globalCompositeOperation = "source-over";
        const ctx = this.ctx();
        if (this.state.isDrawing) {
            ctx.beginPath();
            ctx.moveTo(this.state.lastX, this.state.lastY);
            ctx.strokeStyle = this.props.strokeStyle;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = this.props.lineWidth;
            if (e.touches) {
                // console.log(e.touches[0].clientX);
                // console.log(e.touches[0].clientY);
                const offset = e.target.getBoundingClientRect();
                const pointX = e.touches[0].clientX - offset.x;
                const pointY = e.touches[0].clientY - offset.y;
                ctx.lineTo(pointX, pointY);
                ctx.stroke();
                this.setState({
                    lastX: pointX,
                    lastY: pointY
                });
            } else {
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
                this.setState({
                    lastX: e.nativeEvent.offsetX,
                    lastY: e.nativeEvent.offsetY
                });
            }
        }
    }

    getCanvasBuffer() {
        this.ctx().globalCompositeOperation = "destination-over";
        this.ctx().fillStyle = '#fff';
        this.ctx().fillRect(0, 0, this.props.width, this.props.height);

        return this.canvas().toDataURL('image/jpeg');
    }

    clearCanvas() {
        this.ctx().clearRect(0, 0,
            this.canvas().width, this.canvas().height);
    }

    render() {
        return (
            <div>
                <canvas id={this.props.id} ref='drawingCanvas'
                        className={this.props.className}
                        width={this.props.width}
                        height={this.props.height}

                        onTouchStart={this.onMouseDown}
                        onTouchMove={this.draw}
                        onMouseMove={this.draw}
                        onMouseDown={this.onMouseDown}
                        onTouchEnd={this.onDrawEnd}
                        onMouseUp={this.onDrawEnd}
                        onMouseOut={this.onDrawEnd}/>
            </div>
        );
    }
}

