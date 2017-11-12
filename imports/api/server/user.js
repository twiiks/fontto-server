import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import Future from 'fibers/future';

function log(result, message) {
    return {result: result, message: message}
}

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Meteor.methods({
    resister: function (email, password) {
        if (!validateEmail(email)) {
            throw(log('error', 'invalid email'));
        }
        Accounts.createUser({
            email: email,
            password: password,
            profile: {}
        });

    },
});


// updateCount: function () {
//     Meteor.users.update({_id: Meteor.userId()},
//         {$inc: {'profile.count': 1}})
// }