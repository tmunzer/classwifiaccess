var api = require("./../req");

/**
 * Exposes the Location Folder Hierarchy that a customer uses to associate non-geographic location information with an Access Point/Device.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.locations = function (xapi, devAccount, callback) {
    var path = "/xapi/v1/configuration/apLocationFolders?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback);
};


/**
 * Allows one to retrieve a Location Folder node anywhere within the hierarchy.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} folderId - The id of the desired Location folder
 *  */
module.exports.location = function (xapi, devAccount, folderId, callback) {
    var path = "/xapi/v1/configuration/apLocationFolders/"+folderId+"?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback)
};