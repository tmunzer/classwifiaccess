var User = require("./../models/user");
var Group = require("./../models/group");
var UILanguage = require('./../models/UiLanguage');
var translate = require('./../translate/translate');

module.exports = function(router, isAuthenticated){
    /* GET User Display page. */
    router.get("/user/", isAuthenticated, function(req, res, next){
        // save the userID requested
        var userIdToEdit = req.query.id;
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
            var UserSerializer = new User.UserSerializer(req.body);
            // update the user
            UserSerializer.updateDB(userIdToEdit, function(err){
                res.redirect('/user?id='+userIdToEdit);
            });
        } else {
            res.redirect('/');
        }  });

    /* GET New User page. */
    router.get("/user/new/", isAuthenticated, function(req, res, next){
        // save the userID requested
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
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST New User Edit . */
    router.post("/user/new/", isAuthenticated, function(req, res, next) {
        // check if current user is an admin
        if (req.user.userGroup == 1) {
            // serialize the user
            var userToDB = new User.UserSerializer(req.body);
            // update the user
            userToDB.insertDB(function(err){
                res.redirect('/conf');
            });
        } else {
            res.redirect('/');
        }  });

};
