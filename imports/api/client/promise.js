import {Promise} from 'meteor/promise';

export const promise = (method, params) => {
    return new Promise((resolve, reject) => {
        Meteor.apply(method, params, (error, result) => {
            if (error) {
                reject(JSON.parse(error.reason));
            }
            resolve(result);
        });
    });
};