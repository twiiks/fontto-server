import winston from 'winston';
import 'date-utils';

export const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')}
        })
    ]
});
