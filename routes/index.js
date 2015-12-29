var express = require('express');
var router = express.Router();
var Error = require(appRoot + '/routes/error');

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

var isAdmin = function (req, res, next) {
    if (req.user.GroupId == 1) {
        return next();
    }
    res.redirect("back");
};

var isAtLeastOperator = function(req, res, next) {
    if (req.user.GroupId <= 2){
        return next();
    }
    res.redirect("back");
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
    router.use(translationFile);
    router.use(schoolId);

    /* Login Router */
    require("./login")(router, passport);

    /* Classroom Router */
    require("./classroom")(router, isAuthenticated);

    /* Lesson Router */
    require("./lesson")(router, isAuthenticated);

    /* Device Router */
    require("./device")(router, isAuthenticated, isAtLeastOperator);

    /* Conf Router */
    require("./conf")(router, isAuthenticated, isAtLeastOperator);

    /* User Router */
    require("./conf_user")(router, isAuthenticated, isAtLeastOperator);

    /* School Router */
    require("./conf_school")(router, isAuthenticated, isAtLeastOperator);

    /* Classroom Router */
    require("./conf_classroom")(router, isAuthenticated, isAtLeastOperator);

    /* API Router */
    require("./conf_api")(router, isAuthenticated, isAtLeastOperator);

    /* Dev Router */
    require("./dev")(router, isAuthenticated, isAdmin);

    require("./admin")(router, isAuthenticated, isAdmin);

    router.get("*", function(req, res, next){
        res.redirect("/classroom/");
    });
    return router;

};

