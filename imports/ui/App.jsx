import React, {Component} from 'react';
import PropTypes from 'prop-types';

// 공통 컴퍼넌트가 들어가는 모든 앱의 베이스
export class App extends Component {
    render() {
        return (
            <div className="app">
                {this.props.children}
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node,
};