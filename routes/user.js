var User = require("./../models/user");
var Group = require("./../models/group");
var UILanguage = require('./../models/UiLanguage');
var School = require('./../models/school');

module.exports = function (router, isAuthenticated) {
    /* GET User Display page. */
    router.get("/user/", isAuthenticated, function (req, res, next) {
        // save the userID requested
        var userIdToEdit = req.query.id;
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (req.session.isAdmin)) {
            // get the user to edit in the DB
            User.findById(userIdToEdit, null, function (err, userToEdit) {
                // render the page
                res.render('userDisplay', {
                    user: req.user,
                    userToEdit: userToEdit,
                    user_button: req.translationFile.user_button,
                    user_page: req.translationFile.user_page,
                    buttons: req.translationFile.buttons
                });

            });
        } else {
            res.redirect('/');
        }
    });

    /* GET User Edit page. */
    router.get('/user/edit', isAuthenticated, function (req, res, next) {
        var userIdToEdit = req.query.id;
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (req.session.isAdmin)) {
            // get the user to edit in the DB
            User.findById(userIdToEdit, null, function (err, userToEdit) {
                // Find the language for this user
                // list all groups to display
                Group.getAll(null, function (err, groups) {
                    // list all schools to display
                    School.getAll(null, function (err, schools) {
                        // list all languages to display
                        UILanguage.getAll(null, function (err, languages) {
                            // render the page
                            res.render('userEdit', {
                                user: req.user,
                                userToEdit: userToEdit,
                                groups: groups,
                                schools: schools,
                                languages: languages,
                                user_button: req.translationFile.user_button,
                                user_page: req.translationFile.user_page,
                                buttons: req.translationFile.buttons
                            });
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE User Edit page. */
    router.post("/user/edit", isAuthenticated, function (req, res, next) {
        var userIdToEdit = req.query.id;
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (req.session.isAdmin)) {
            // serialize the user
            var UserSerializer = new User.UserSerializer(req.body);
            // update the user
            UserSerializer.updateDB(userIdToEdit, function (err) {
                res.redirect('/user?id=' + userIdToEdit);
            });
        } else {
            res.redirect('/');
        }
    });

    /* GET New User page. */
    router.get("/user/new/", isAuthenticated, function (req, res, next) {
        // save the userID requested
        // check if current user is an admin
        if (req.session.isAdmin) {
            // Find the language for this user
            // list all groups to display
            Group.getAll(null, function (err, groups) {
                // list all schools to display
                School.getAll(null, function (err, schools) {
                    // list all languages to display
                    UILanguage.getAll(null, function (err, languages) {
                        // render the page
                        res.render('userEdit', {
                            user: req.user,
                            userToEdit: new User(),
                            groups: groups,
                            schools: schools,
                            languages: languages,
                            user_button: req.translationFile.user_button,
                            user_page: req.translationFile.user_page,
                            buttons: req.translationFile.buttons
                        });
                    });

                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE New User Edit . */
    router.post("/user/new/", isAuthenticated, function (req, res, next) {
        // check if current user is an admin
        if (req.session.isAdmin) {
            // serialize the user
            var userToDB = new User.UserSerializer(req.body);
            // update the user
            userToDB.insertDB(function (err) {
                res.redirect('/conf');
            });
        } else {
            res.redirect('/');
        }
    });
    router.get('/user/delete', isAuthenticated, function(req, res) {
        if (req.session.isAdmin) {
            if (req.query.hasOwnProperty("id")){
                var userId = req.query.id;
                User.deleteById(userId, function(){
                    res.redirect("/conf");
                })

            }
        } else {
            res.redirect("/conf");
        }
    })
};
