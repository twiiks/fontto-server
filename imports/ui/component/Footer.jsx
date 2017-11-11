import React, {Component} from 'react';

import '../style/component/Footer.scss';

export class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='footer'>
                <div className='left'>
                    <div className='contents'>
                        <div className='title'>team twiiks</div>
                        <div className='content'>
                            소프트웨어 마에스트로 8th 연수생인
                            성준영, 장상현, 서상범으로 이루어진
                            팀워크가 넘치는 팀입니다.
                            <br/>
                            서로에 대한 신뢰를
                            가장 우선으로 여기며
                            좋은 소프트웨어를 만들고자
                            열정을 쏟아고 있습니다.
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='contents'>
                        <div className='title'>contact us</div>
                        <div className='content'>
                            email : wnsdud1861@gmail.com <br/>
                            phone : 010-7758-1837 <br/>
                            address : 서울 특별시 강남구 테헤란로 311(역삼동) 아남타워 빌딩 6층, 7층 <br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
