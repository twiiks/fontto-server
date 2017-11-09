import amqp from 'amqplib/callback_api';
import randomstring from 'randomstring';
import randomUnicode from 'random-unicodes';
import Future from 'fibers/future';

function log(result, message) {
    return {result: result, message: message}
}

Meteor.methods({
    testEnqueue: function (queueNameParam, userIdParam, unicodesParam) {
        const amqpUrl = process.env["FONTTO_AMQP_URL"];
        const f = new Future();

        let queue = "";
        if (queueNameParam !== "") {
            queue = queueNameParam;
        } else {
            queue = queue = process.env["FONTTO_QUEUE"];
        }

        // userId check
        let userId;
        if (userIdParam !== "") {
            userId = userIdParam;
        } else {
            userId = randomstring.generate({length: 10, charset: 'alphanumeric'});
        }

        // unicodes check
        let unicodes = [];
        if (unicodesParam.length !== 0) {
            unicodes = unicodesParam;
        } else {
            // 유니코드 지정하려면 수정 (랜덤한 갯수의 랜덤한 한글 유니코드를 unicodes 어레이에 푸시)
            const randomCount = randomstring.generate({length: 1, charset: 'numeric'}) * 1 + 1;

            for (let i = 0; i < randomCount; i++) {
                // 한글 유니코드 ac00 ~ d7a3
                const korRandomUnicodeBefore = randomUnicode({min: '\\uAC00', max: '\\uD7A3'});
                const korRandomUnicode = korRandomUnicodeBefore.substring(2, 6).toLowerCase();
                unicodes.push(korRandomUnicode)
            }
        }

        amqp.connect(amqpUrl, function (err, conn) {
            if (err) return f.throw(log('error', 'connection error'));

            conn.createChannel(on_open);

            function on_open(err, ch) {
                const count = 1;
                if (err !== null) bail(err);
                ch.assertQueue(queue);
                const messageObj = {};
                messageObj.userId = userId;
                messageObj.count = count;
                messageObj.unicodes = [];
                messageObj.env = process.env['FONTTO_ENV'];
                messageObj.unicodes = unicodes;

                const message = JSON.stringify(messageObj);

                const result = ch.sendToQueue(queue, new Buffer(message));
                if (result) {
                    console.log(log('ok', 'enqueue success'));
                    console.log(message);
                    return f.return(log('ok', 'enqueue success'));
                } else {
                    console.log(log('error', 'enqueue fail'));
                    return f.throw(log('error', 'enqueue fail'));
                }

            }
        });

        return f.wait();
    }
});