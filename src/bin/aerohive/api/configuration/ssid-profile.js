var api = require("./../req");


/**
 * Get the Filtering Rules for the given SSID Profile ID
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} ssidProfileId - The ID of the SSID Profile
 *  */
module.exports.ssidForDevice = function (xapi, devAccount, ssidProfileId, callback) {
    var path = "/xapi/beta/configuration/ssids/" + ssidProfileId + "/filters?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback);
};

/**
 * Updates the SSID Configuration for the specified device.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} ssidProfileId - The ID of the SSID Profile
 * @param {Object} changes - The full list of all Filtering rule applied to this SSID Profile.
 * @param {Boolean=} changes.enableMacFilters - Whether MAC filtering rules should be applied for this SSID
 * @param {String=} changes.macFilterDefaultAction - filtering rule that affects all traffic on the SSID = ['PERMIT', 'DENY']
 * @param {ArrayOfObjects=} changes.rules - MAC filtering rules that only apply to specific clients on the SSID
 * @param {String=} changes.rules[].action - Whether to permit or deny the Mac object = ['PERMIT', 'DENY']
 * @param {String=} changes.rules[].type - The type of MAC Filter object as defined by MacFilterType values = ['MAC_ADDRESS', 'MAC_OUI']
 * @param {String=} changes.rules[].value - The value of this MAC Filter object as defined by the type
 *  */
module.exports.updateSsid = function (xapi, devAccount, ssidProfileId, changes, callback) {
    var path = "/xapi/beta/configuration/ssids/" + ssidProfileId + "/filters?ownerId=" + xapi.ownerId;
    api.PUT(xapi, devAccount, path, changes, callback);
};

