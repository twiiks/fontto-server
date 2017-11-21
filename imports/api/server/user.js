import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {logger} from './logger';

function resultObj(result, code) {
    if (result === 'error')
        return JSON.stringify({result: result, code: code});
    return {result: result, code: code}
}

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Meteor.methods({
    checkLogin: function (status, email) {
        switch (status) {
            case 'NOT_MATCHED':
                logger.log('info', 'login [try]: not matched / email:%s', email);
                break;
            case 'INVALID_PASSWORD':
                logger.log('info', 'login [try]: invalid password / email:%s', email);
                break;
            case 'SUCCEED':
                logger.log('info', 'login [success]: user logged in / email:%s', email);
                break;
        }
        return status;
    },

    resister: function (email, password) {
        try {
            const result = Accounts.createUser({
                email: email,
                password: password,
                profile: {
                    createdAt: new Date(),
                    profileImageUrl: '',
                    count: 0
                }
            });
            logger.log('info', 'signup [success]: user created / email:%s', email);
            if (result) return resultObj('ok', 'user created! : ' + result);
        } catch (err) {
            logger.log('info', 'signup [try]: user duplicated / email:%s', email);
            throw new Meteor.Error(500, resultObj('error', 'USER_EXIST'));
        }
    },

    checkValidEmail: function (email) {
        if (validateEmail(email)) {
            return resultObj('ok', 'SUCCEED');
        } else {
            logger.log('info', 'signup [try]: email not valid / invalid email:%s', email);
            throw new Meteor.Error(500, resultObj('error', 'EMAIL_NOT_VALID'));
        }
    },

    confirmPassword: function (password, confirmPassword) {
        if (password !== confirmPassword) {
            logger.log('info', 'signup [try]: confirm password not matched');
            throw new Meteor.Error(500, resultObj('error', 'NOT_MATCHED'));
        } else {
            return resultObj('ok', 'SUCCEED');
        }
    },

    checkPasswordLength: function (password) {
        if (password.length < 6) {
            logger.log('info', 'signup [try]: password too short');
            throw new Meteor.Error(500, resultObj('error', 'LENGTH_SHORT'));
        } else {
            return resultObj('ok', 'SUCCEED')
        }
    },

    getUserEmailById: function (userId) {
        if (Meteor.user())
            return Meteor.users.find({_id: userId}).fetch()[0].emails[0].address;
        else {
            throw new Meteor.Error(500, resultObj('error', 'NOT_LOGGED_IN'))
        }
    }
});
