/**
 * 업로드 관련 API
 */

import AWS from 'aws-sdk';
import Future from 'fibers/future';
import {logger} from './logger';
import request from 'request';

function resultObj(result, code) {
    if (result === 'error')
        return JSON.stringify({result: result, code: code});
    return {result: result, code: code}
}

const environment = process.env.FONTTO_ENV;

Meteor.methods({
    requestGenerate: function (unicodes) {
        const f = new Future();
        console.log(unicodes);
        request.post({
                url: 'http://13.125.77.172:5000',
                json: {
                    userId: Meteor.userId(),
                    unicodes: unicodes,
                    count: Meteor.user().profile.count,
                    env: environment
                }
            },
            function (err, httpResponse, body) {
                console.log(body);
                return f.return(body);
            });

        return f.wait();
    }
});