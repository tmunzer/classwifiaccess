/******************************************************************************
 *                                 NOTES                                    *
 *
 *      This file is an example
 *      Please move this file config_example.js to config.js
 *      and chage the values to match your configuration
 *
******************************************************************************/

/******************************************************************************
 *                                 SERVER                                    *
******************************************************************************/
module.exports.appServer = {
    vhost: "localhost",
    // Enable HTTPS directly with NodeJS. 
    // Set to false if you are using a reverse proxy to manage HTTPS (nginx, apache, ...)
    //enableHttps: true,
    // used if enableHttps = true
    // certificate name. The certificate has to be installed into certs folder
    //httpsCertificate: "default.pem",
    // key name. The key has to be installed into certs folder, without password
    //httpsKey: "default.key"
}

/******************************************************************************
 *                           Aerohive ACS                                    *
******************************************************************************/
// the Aerohive ACS parameters have to match your app configuration on your
// developper portal account (https://developper.aerohive.com)
module.exports.devAccount = {
    // redirectUrl HAS TO be HTTPS
    // please be sure to append "/admin/oauth/reg" to the end of the redirectUrl
    redirectUrl: "https://education.ah-lab.fr/api/oauth",
    clientSecret: "cd09b17154c3b5679ddf01b0fbc2efc1",
    clientID: "5ce232a0"
}

/******************************************************************************
 *                                MongoDB                                    *
******************************************************************************/
module.exports.mongoConfig = {
    host: "localhost",
    base: "classwifiaccess"
}




