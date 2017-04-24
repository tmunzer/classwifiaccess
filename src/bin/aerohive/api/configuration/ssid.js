var api = require("./../req");

/**
 * Retrieves SSID related configuration information for the specified device.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} deviceId - The Id of the desired device
 *  */
module.exports.ssidForDevice = function (xapi, devAccount, deviceId, callback) {
    var path = "/xapi/beta/configuration/devices/" + deviceId + "/ssids?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback);
};

/**
 * Provides information about the configured Pre-shared Key or Private Pre-shared Key for the specified SSID.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} ssidProfileId - The ID of the desired SSID
 *  */
module.exports.pskForSsid = function (xapi, devAccount, ssidProfileId, callback) {
    var path = "/xapi/beta/configuration/ssids/" + ssidProfileId + "/psk?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback);
};

/**
 * Provides information about the configured SSID Profiles
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.ssidProfiles = function (xapi, devAccount, callback) {
    var path = "/xapi/beta/configuration/ssids?ownerId=" + xapi.ownerId;
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
 * @param {String} deviceId - The Id of the desired device
 * @param {ArrayOfObjects} changes - The changes to be applied to the SSID Configuration for the specified device.
 * @param {Boolean=} changes[].disableAllSSIDs - Are all SSIDs for this WiFi interface disabled? 
 * @param {String=} changes[].interfaceName - The WiFi interface name applicable to this SSID Configuration. = ['wifi0', 'wifi1', 'DUAL']
 * @param {ArrayOfObjects=} changes[].entries - The list of SSID Configuration instances associated with this Radio Band. 
 * @param {Boolean=} changes[].entries[].disable - The enable/disable status of an SSID Profile ID (true indicates disabled, false indicates enabled) 
 * @param {Integer=} changes[].entries[].ssidProfileID - The unique ID of the SSID Profile for this configuration.
 *  */
module.exports.updateSsid = function (xapi, devAccount, deviceId, changes, callback) {
    var path = "/xapi/beta/configuration/devices/" + deviceId + "/ssids?ownerId=" + xapi.ownerId;
    api.PUT(xapi, devAccount, path, changes, callback);
};


/**
 * Updates information about the configured Pre-shared Key or Private Pre-shared Key for the specified SSID.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} ssidProfileId - The ID of the desired SSID
 * @param {Object} changes - The PSK or PPSK configuration changes to be applied to this SSID and network policy.
 *  */
module.exports.updatePsk = function (xapi, devAccount, ssidProfileId, changes, callback) {
    var path = "/xapi/beta/configuration/ssids/" + ssidProfileId + "/psk?ownerId=" + xapi.ownerId;
    api.PUT(xapi, devAccount, path, changes, callback);
};