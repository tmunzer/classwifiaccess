var express = require('express');
var User = require("./../models/user");
var Group = require("./../models/group");
var Api = require("./../models/api");
var UILanguage = require("./../models/uiLanguage");
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

    /* GET login page. */
    router.get('/login', function(req, res) {
        translate(null, req, function(translationFile){
            // Display the Login page with any flash message, if any
            res.render('login', { message: translationFile.login_page[req.flash('message')], text : translationFile.login_page });
        });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));

    /* Handle Logout */
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    /* GET Home Page */
    router.get('/', isAuthenticated, function(req, res) {
        User.findById(req.query.id, null, function (err, user) {
            translate(user, req, function (translationFile) {
                res.render('index', {user: req.user, user_button: translationFile.user_button});
            });
        });
    });

    /* GET Regsiter APP Page with the auth code */
    router.get('/reg/app', isAuthenticated, function(req, res) {
        if (req.user.userGroup == 1) {
            var authCode = req.query.authCode;
            var api = new Api();
            api.registerApp(authCode, function(apiDataString){
                var apiDataJSON = JSON.parse(apiDataString);
                for (var owner in apiDataJSON.data){
                    console.log(apiDataJSON.data);
                    var apiReg = new Api.ApiToDB(apiDataJSON.data[owner]);
                    apiReg.insertDB(function(err){
                        res.redirect('/conf');
                    });
                }
            });
        }
    });


    /* GET Conf listing. */
    router.get('/conf', isAuthenticated, function(req, res, next) {
        if (req.user.userGroup == 1) {
            translate(req.user.language, req, function (translationFile) {
                User.getAll(null, function(err, userList){
                    Group.getAll(null, function(err, groupList){
                        Api.getAll(null, function(err, ApiList) {
                            res.render('conf', {
                                user: req.user,
                                user_button: translationFile.user_button,
                                config_page: translationFile.config_page,
                                user_page: translationFile.user_page,
                                userList: userList,
                                groupList: groupList,
                                apiList: ApiList,
                                redirectUrl: Api.getRedirectUrl(),
                                clientId: Api.getClientId()
                            });
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        };
    });


    /* GET User Display page. */
    router.get("/user", isAuthenticated, function(req, res, next){
        // save the userID requested
        var userIdToEdit = req.query.id;
        var fromUrl = getFromUrl(req, "/");
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (req.user.userGroup == 1)) {
            // get the user to edit in the DB
            User.findById(userIdToEdit, null, function(err, userToEdit) {
                // Find the language for this user
                translate(req.user.language, req, function (translationFile) {
                    // list all groups to display
                    Group.getAll(null, function (err, groups) {
                        // list all languages to display
                        UILanguage.getAll(null, function (err, languages) {
                            // render the page
                            res.render('userDisplay', {
                                user: req.user,
                                userToEdit: userToEdit,
                                groups: groups,
                                languages: languages,
                                user_button: translationFile.user_button,
                                user_page: translationFile.user_page,
                                fromUrl: fromUrl
                            });
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });

    /* GET User Edit page. */
    router.get('/user/edit', isAuthenticated, function(req, res, next) {
        var userIdToEdit = req.query.id;
        var fromUrl = getFromUrl(req, "/user?id="+userIdToEdit);
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (req.user.userGroup == 1)) {
            // get the user to edit in the DB
            User.findById(userIdToEdit, null, function(err, userToEdit) {
                // Find the language for this user
                translate(req.user.language, req, function (translationFile) {
                    // list all groups to display
                    Group.getAll(null, function (err, groups) {
                        // list all languages to display
                        UILanguage.getAll(null, function (err, languages) {
                            // render the page
                            res.render('userEdit', {
                                user: req.user,
                                userToEdit: userToEdit,
                                groups: groups,
                                languages: languages,
                                user_button: translationFile.user_button,
                                user_page: translationFile.user_page,
                                fromUrl: fromUrl
                            });
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST User Edit page. */
    router.post("/user/edit", isAuthenticated, function(req, res, next) {
        var userIdToEdit = req.query.id;
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (req.user.userGroup == 1)) {
            // serialize the user
            var userToDB = new User.UserToDB(req.body);
            // update the user
            userToDB.updateDB(userIdToEdit, function(err){
                res.redirect('/user?id='+userIdToEdit);
            });
        } else {
            res.redirect('/');
        }  });

    /* GET New User page. */
    router.get("/user/new", isAuthenticated, function(req, res, next){
        // save the userID requested
        var fromUrl = getFromUrl(req, "/");
        // check if current user is an admin
        if  (req.user.userGroup == 1) {
            // Find the language for this user
            translate(req.user.language, req, function (translationFile) {
                // list all groups to display
                Group.getAll(null, function (err, groups) {
                    // list all languages to display
                    UILanguage.getAll(null, function (err, languages) {
                        // render the page
                        res.render('userEdit', {
                            user: req.user,
                            userToEdit: new User(),
                            groups: groups,
                            languages: languages,
                            user_button: translationFile.user_button,
                            user_page: translationFile.user_page,
                            fromUrl: fromUrl
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST New User Edit . */
    router.post("/user/new", isAuthenticated, function(req, res, next) {
        // check if current user is an admin
        if (req.user.userGroup == 1) {
                // serialize the user
                var userToDB = new User.UserToDB(req.body);
                // update the user
                userToDB.insertDB(function(err){
                    res.redirect('/conf');
                });
        } else {
            res.redirect('/');
        }  });

    /* GET Dev tools */
    router.get("/dev", isAuthenticated, function(req, res, next) {
       if (req.user.userGroup == 1) {
           translate(req.user.language, req, function (translationFile) {

               res.render('dev', {
                   user: req.user,
                   user_button: translationFile.user_button
               })
           });
       }
    });

    router.get("/*", function(req, res, next){
        res.redirect('/');
    });

    return router;

};

function translate(language, req, callback){
    if (language != null){
        UILanguage.findById(language, {columns:["code"]}, function(err, language) {
            callback(locateTranslation(language.code));
        });
    } else {
        language = req.headers["accept-language"].toLowerCase();
        callback(locateTranslation(language));
    }

}

function locateTranslation(language){
    switch (true){
        case language == null:
            return require('./../translate/en');
            break;
        case language.indexOf("fr") == 0:
            return require('./../translate/fr');
            break;
        case language.indexOf("en") == 0:
            return require('./../translate/en');
            break;
        default:
            return require('./../translate/en');
            break;
    }
}

function getFromUrl(req, def){
    if (req.headers.hasOwnProperty('referer')){
        var fromUrl = req.headers.referer.substr(req.headers.host + req.headers.host.length);
    } else {
        var fromUrl = def;
    }
    return fromUrl;
}