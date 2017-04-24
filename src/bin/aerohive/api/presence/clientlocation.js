var api = require("./../req");

/**
 * Returns a count of the number of clients seen during the specified time period with a timeUnit of OneHour.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} location - The location that you'd like to check against.
 * @param {String} startTime - The start time of the query (ISO-8601 format).
 * @param {String} endTime - The end time of the query (ISO-8601 format) 
 *  */
module.exports.clientcount = function (xapi, devAccount, location, startTime, endTime, callback) {
    var path = "/xapi/v1/clientlocation/clientcount?" +
        "ownerId=" + xapi.ownerId +
        "&location=" + location +
        "&startTime=" + startTime +
        "&endTime=" + endTime;
    api.GET(xapi, devAccount, path,  callback);
};

/**
 * Returns a list of distinct clients during the specified time period broken down by the specified time unit.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} location - The location that you'd like to check against.
 * @param {String} startTime - The start time of the query (ISO-8601 format).
 * @param {String} endTime - The end time of the query (ISO-8601 format)
 * @param {String} timeUnit - The time unit by which you want to roll up the returned items.
 *  */
module.exports.clientpresence = function (xapi, devAccount, location, startTime, endTime, timeUnit, callback) {
    var path = "/xapi/v1/clientlocation/clientpresence?" +
        "ownerId=" + xapi.ownerId +
        "&location=" + location +
        "&startTime=" + startTime +
        "&endTime=" + endTime +
        "&timeUnit=" + timeUnit;
    api.GET(xapi, devAccount, path,  callback);
};


/**
 * Returns a list of distinct clients during the specified time period broken down by the specified time unit.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} location - The location that you'd like to check against.
 * @param {String} startTime - The start time of the query (ISO-8601 format).
 * @param {String} endTime - The end time of the query (ISO-8601 format)
 * @param {String} timeUnit - The time unit by which you want to roll up the returned items.
 *  */
module.exports.clienttimeseries = function (xapi, devAccount, location, startTime, endTime, timeUnit, callback) {
    var path = "/xapi/v1/clientlocation/clienttimeseries?" +
        "ownerId=" + xapi.ownerId +
        "&location=" + location +
        "&startTime=" + startTime +
        "&endTime=" + endTime +
        "&timeUnit=" + timeUnit;
    api.GET(xapi, devAccount, path, callback);
};

/**
 * Returns a list of client sessions and waypoints during the specified time period
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} location - The location that you'd like to check against.
 * @param {Boolean} waypoints - Should waypoints be shown
 * @param {String} startTime - The start time of the query (ISO-8601 format).
 * @param {String} endTime - The end time of the query (ISO-8601 format)
 *  */
module.exports.clientsessions = function (xapi, devAccount, location, waypoints, startTime, endTime, callback) {
    var path = "/xapi/v1/clientlocation/clientsessions?" +
        "ownerId=" + xapi.ownerId +
        "&location=" + location +
        "&waypoints=" + waypoints +
        "&startTime=" + startTime +
        "&endTime=" + endTime;
    api.GET(xapi, devAccount, path,  callback);
};

/**
 * Returns a list of client sessions and waypoints during the specified time period.
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account ClientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 * @param {String} location - The location that you'd like to check against.
 * @param {String} startTime - The start time of the query (ISO-8601 format).
 * @param {String} endTime - The end time of the query (ISO-8601 format)
 *  */
module.exports.waypoints = function (xapi, devAccount, location, startTime, endTime, callback) {
    var path = "/xapi/v1/clientlocation/waypoints?" +
        "ownerId=" + xapi.ownerId +
        "&location=" + location +
        "&startTime=" + startTime +
        "&endTime=" + endTime;
    api.GET(xapi, devAccount, path, callback);
};
