import amqp from 'amqplib/callback_api';
import Future from 'fibers/future';
import {logger} from './logger';

function resultObj(result, code) {
    if (result === 'error')
        return JSON.stringify({result: result, code: code});
    return {result: result, code: code}
}

Meteor.methods({
    enqueue: function (unicodes) {
        const amqpUrl = process.env["FONTTO_AMQP_URL"];
        const f = new Future();
        const queue = process.env["FONTTO_QUEUE"];

        const userId = Meteor.userId();
        const userEmail = Meteor.user().emails[0].address;
        const count = Meteor.user().profile.count;

        amqp.connect(amqpUrl, function (err, conn) {
            if (err) return f.throw(log('error', 'connection error'));

            conn.createChannel(on_open);

            function on_open(err, ch) {
                if (err !== null) bail(err);
                ch.assertQueue(queue);

                const messageObj = {};
                messageObj.userId = userId;
                messageObj.count = count;
                messageObj.unicodes = unicodes;
                messageObj.env = process.env['FONTTO_ENV'];
                messageObj.email = userEmail;

                const message = JSON.stringify(messageObj);

                const result = ch.sendToQueue(queue, new Buffer(message));
                if (result) {
                    logger.log('info', 'encqueue [success] / email:%s', userEmail);
                    return f.return(resultObj('ok', 'ENQUEUE_SUCCESS'));
                } else {
                    logger.log('error', 'encqueue [fail / email:%s', userEmail);
                    throw new Meteor.Error(500, resultObj('error', 'ENQUEUE_FAIL'));
                }

            }
        });


        return f.wait();
    }
});