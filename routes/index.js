var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/login');
};

module.exports = function(passport){

    /* Login Router */
    require("./login")(router, passport);

    /* Conf Router */
    require("./conf")(router, isAuthenticated);

    /* User Router */
    require("./user")(router, isAuthenticated);

    /* API Router */
    require("./api")(router, isAuthenticated);

    /* Home Router */
    require("./home")(router, isAuthenticated);

    /* Device Router */
    require("./device")(router, isAuthenticated);

    /* Dev Router */
    require("./dev")(router, isAuthenticated);

    router.get("/*", function(req, res, next){
        res.redirect('/home');
    });

    return router;

};

