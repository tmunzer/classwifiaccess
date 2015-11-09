var express = require('express');
var router = express.Router();
var translate = require('./../translate/translate');
var Api = require("./../models/api");

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/login');
};

var isAdmin = function(req, res, next){
    req.isAdmin = req.user.GroupId == 1;
    Api.getAll(null, function(apiList){
        req.apiList = apiList;
        console.log(apiList);
        return next();
    });
};

var translationFile = function(req, res, next) {
    var userLanguage;
    if (req.user){
        userLanguage = req.user.language;
    } else {
        userLanguage = null;
    }
    translate(userLanguage, req, function (translationFile) {
        req.translationFile = translationFile;
        next();
    })
};

module.exports = function(passport){



    /* Login Router */
    require("./login")(router, passport, translationFile);

    /* Conf Router */
    require("./conf")(router, isAuthenticated, isAdmin, translationFile);

    /* User Router */
    require("./user")(router, isAuthenticated, isAdmin, translationFile);

    /* API Router */
    require("./api")(router, isAuthenticated, isAdmin, translationFile);

    /* Home Router */
    require("./home")(router, isAuthenticated, isAdmin, translationFile);

    /* Device Router */
    require("./device")(router, isAuthenticated, isAdmin, translationFile);

    /* Dev Router */
    require("./dev")(router, isAuthenticated, isAdmin, translationFile);

    router.get("/*", function(req, res, next){
        res.redirect('/home');
    });

    return router;

};

