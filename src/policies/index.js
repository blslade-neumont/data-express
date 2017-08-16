let { extractUserPolicy } = require('./extract-user.policy');
let { isLoggedInPolicy } = require('./is-logged-in.policy');
let { isAdminPolicy } = require('./is-admin.policy');

module.exports = {
    extractUserPolicy: extractUserPolicy,
    isLoggedInPolicy: isLoggedInPolicy,
    isAdminPolicy: isAdminPolicy
}
