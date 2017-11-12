
function log(result, message) {
    return {result: result, message: message}
}

Meteor.methods({
    login: function (id, pw) {
        console.log(id, pw);
    }
});