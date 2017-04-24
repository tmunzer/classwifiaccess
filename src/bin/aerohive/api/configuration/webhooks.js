var api = require("./../req");

/**
 * Provides a list of all supported Event Types available for subscription.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.eventTypes = function (xapi, devAccount, callback) {
    var path = "/xapi/beta/configuration/webhooks/eventTypes?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback);
};
/**
 * Provides a list of all supported Message Types for the specified Event Type.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} eventType - The event type.
 *  */
module.exports.messageTypes = function (xapi, devAccount, eventType, callback) {
    var path = "/xapi/beta/configuration/webhooks/messageTypes?ownerId=" + xapi.ownerId + "&eventType=" + eventType;
    api.GET(xapi, devAccount, path, callback);
};
/**
 * Provides access to the list of current Webhook subscriptions.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.get = function (xapi, devAccount, callback) {
    var path = "/xapi/beta/configuration/webhooks?ownerId=" + xapi.ownerId;
    api.GET(xapi, devAccount, path, callback);
};

/**
 * Creates a new Webhook subscription
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {Object} subscription - The subscription parameters
 * @param {String} subscription.application - The application name that receives a callback as a result of the subscription.
 * @param {String} subscription.ownerId - The id of the customer that owns this device.
 * @param {String} subscription.secret - The shared secret sent to the subscribing application. 
 * @param {String} subscription.url - The https URL to receive a callback as a result of the subscription
 *  */
module.exports.create = function (xapi, devAccount, subscription, callback) {
    var path = "/xapi/beta/configuration/webhooks";
    subscription.ownerId = xapi.ownerId;
    for (var key in subscription) {
        if (subscription[key] === '') delete subscription[key];
    }
    api.POST(xapi, devAccount, path, subscription, callback);
};


/**
 * Deletes Webhook subscription
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} subscriptionId - The subscription parameters
 *  */
module.exports.remove = function (xapi, devAccount, subscriptionId, callback) {
    var path = "/xapi/beta/configuration/webhooks/" + subscriptionId + "/?ownerId=" + xapi.ownerId;
    api.DELETE(xapi, devAccount, path, callback);
};