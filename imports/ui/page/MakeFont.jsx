import React, {Component} from 'react';
import {Header} from '../component/Header';

export class MakeFont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
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
        return (
            <div className='make-font'>
                <Header history={this.props.history}
                        rightLongContents={
                            <div style={{marginRight: 8}}>폰트생성하기</div>
                        }/>

            </div>
        );
    }
}
