module.exports.configuration = {
    /* ========================================================
    configuration-device-location : Device Location Endpoints
    ======================================================== */
    locations: require("./configuration/location"),

    /* ======================================================================
    configuration-ssid : Configuration Endpoints for SSID related operations.
    ====================================================================== */
    ssids:  require("./configuration/ssid"),

    /* ======================================================================
    configuration-ssid : Configuration Endpoints for SSID related operations.
    ====================================================================== */
    ssidFilters: require("./configuration/ssid-profile"),

    /* ======================================================================
    configuration-webhooks : Configuration Endpoints for Webhook Subscriptions
    ====================================================================== */
    webhooks: require("./configuration/webhooks")
       
};

module.exports.location = {
    /* ======================================================================
    location-realtime : Location Endpoints for Current Client Geo-Location Information
    ====================================================================== */
    clients: require("./location/realtime").clients

}

module.exports.identity = {
    /* ======================================================================
    identity-management-user-groups : User Group Management Endpoints
    ====================================================================== */
    userGroups: require("./identity/userGroups"),

    /* ======================================================================
    identity-management-credentials : Credential Management Endpoints
    ====================================================================== */
    credentials:  require("./identity/credentials"),
};

module.exports.monitor = {
    /* ======================================================================
    monitoring-devices : Device Monitoring Endpoints
    ====================================================================== */
    devices: require("./monitor/device"),

    /* ======================================================================
    monitoring-client-devices : Monitoring Endpoints for Client Devices Connected to Aerohive Devices
    ====================================================================== */
    clients:  require("./monitor/client")
};


module.exports.presence = {
    /* ======================================================================
    presence-analytics : Presence Analytics Endpoints
    ====================================================================== */
    clientlocation: require("./presence/clientlocation")
};

