var api = require("./../req");

/**
 * Allows one to query the collection of user groups given query parameters as input
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {Array} apMacs - A comma seperated list of AP Mac Addresses.
 *  */
module.exports.clients = function (xapi, devAccount, apMacs, callback) {

    var path = '/xapi/v1/location/clients?ownerId=' + xapi.ownerId + "&apMacs=" + apMacs;

    // send the API request
    api.GET(xapi, devAccount, path,  callback);
};