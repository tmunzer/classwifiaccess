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

//===============MIDDLEWARE=================
var translate = require('./../translate/translate');
var Api = require("./../models/api");

var isAdmin = function(req, res, next){
    if (!req.session.hasOwnProperty('isAdmin')){
        req.session.isAdmin == undefined;
    }
    if ((req.user && req.session.isAdmin == undefined)){
        req.session.isAdmin = req.user.GroupId == 1;
    }
    next();
};

var translationFile = function(req, res, next) {
    var userLanguage;
    if (req.user){
        userLanguage = req.user.LanguageId;
    } else {
        userLanguage = null;
    }
    translate(userLanguage, req, function (translationFile) {
        req.translationFile = translationFile;
        next();
    })
};

var schoolId = function(req, res, next){
    if (!req.session.hasOwnProperty('SchoolId')){
        req.session.SchoolId =  undefined;
    }
    if ((req.user) && (req.session.SchoolId == undefined)) {
        req.session.SchoolId = req.user.SchoolId;
    }
    next();
};

//===============ROUTER=================
module.exports = function(passport){
    router.use(isAdmin);
    router.use(translationFile);
    router.use(schoolId);

    /* Login Router */
    require("./login")(router, passport);

    /* Conf Router */
    require("./conf")(router, isAuthenticated);

    /* User Router */
    require("./user")(router, isAuthenticated);

    /* School Router */
    require("./school")(router, isAuthenticated);

    /* Classroom Router */
    require("./classroom")(router, isAuthenticated);

    /* API Router */
    require("./api")(router, isAuthenticated);

    /* Home Router */
    require("./home")(router, isAuthenticated);

    /* Device Router */
    require("./device")(router, isAuthenticated);

    /* Dev Router */
    require("./dev")(router, isAuthenticated);

    require("./admin")(router, isAuthenticated);

    router.get("/*", function(req, res, next){
        res.redirect('/home');
    });

    return router;

};

