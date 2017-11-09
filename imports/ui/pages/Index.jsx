import React, {Component} from 'react';

import {Button} from '../components/Button';

export class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="index">
                main page
                <Button label='test'/>
            </div>
        );
    }
}
