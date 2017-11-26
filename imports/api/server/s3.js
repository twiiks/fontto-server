/**
 * 업로드 관련 API
 */

import AWS from 'aws-sdk';
import moment from 'moment';
import Future from 'fibers/future';
import {logger} from './logger';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucketName = 'fontto';
const params = {
    Bucket: bucketName,
    ACL: 'public-read'
};

const environment = process.env.FONTTO_ENV;

function resultObj(result, code) {
    if (result === 'error')
        return JSON.stringify({result: result, code: code});
    return {result: result, code: code}
}

Meteor.methods({
    uploadHandwritesToS3: function (b64Images) {
        const f = new Future();
        const size = Object.keys(b64Images).length;

        let count = 0;
        for(let unicode in b64Images) {
            let fileBuffer = new Buffer
            (b64Images[unicode].replace(/^data:image\/\w+;base64,/, ""), 'base64');

            const userEmail = Meteor.user().emails[0].address;
            const userCount = Meteor.user().profile.count + 1;
            const folderName = environment + '/inputs/'
                + Meteor.userId() + '/' + userCount + '/';
            const fileName = unicode.toUpperCase() + '.jpg';

            params.Key = folderName + fileName;
            params.ContentType = 'image/jpeg';
            params.Body = fileBuffer;

            const putObjectPromise = s3.putObject(params).promise();
            putObjectPromise.then(function (data) {
                count ++;
                logger.log('info', 'image upload [success]: user upload %s / email:%s',
                    unicode, userEmail);
                if(count === size){
                    return f.return(resultObj('ok', 'upload complete!'));
                }
            }).catch(function (err) {
                logger.log('error', 'image upload [fail]: cannot upload upload %s / email:%s');
                throw new Meteor.Error(500, resultObj('error', 'FAIL_TO_UPLOAD'))
            });
        }
        return f.wait();
    },

    uploadToS3: function (fileBase64, label, user) {
        const f = new Future();
        let fileBuffer = new Buffer(fileBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        const folderName = 'twiiks_fonts/' + user + '/';
        const fileName = label.toUpperCase();

        params.Key = folderName + fileName;
        params.ContentType = 'image/jpeg';
        params.Body = fileBuffer;

        const putObjectPromise = s3.putObject(params).promise();
        putObjectPromise.then(function (data) {
            return f.return('https://s3.ap-northeast-2.amazonaws.com/fontto/' + folderName + fileName);
        }).catch(function (err) {
            console.log(err);
            return f.throw(err);
        });


        return f.wait();
    }
});