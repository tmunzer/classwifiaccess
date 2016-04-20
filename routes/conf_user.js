var User = require(appRoot + "/models/user");
var Group = require(appRoot + "/models/group");
var UILanguage = require(appRoot + '/models/uiLanguage');
var School = require(appRoot + '/models/school');
var Error = require(appRoot + '/routes/error');

function renderEditUser(message, userToEdit, req, res) {
    // if user is not admin (ie if user is operator)
    var filterStringSchool = null;
    if (req.user.GroupId != 1) {
        filterStringSchool = {id: req.user.SchoolId};
    }
    Group.getAll(null, function (err, groups) {
        if (err) Error.render(err, "conf", req, res);
        else {
            // list all schools to display
            School.findAll(filterStringSchool, null, function (err, schools) {
                if (err) Error.render(err, "conf", req, res);
                else {
                    // list all languages to display
                    UILanguage.getAll(null, function (err, languages) {
                        if (err) Error.render(err, "conf", req, res);
                        else {
                            // render the page
                            res.render('conf_userEdit', {
                                message: message,
                                userToEdit: userToEdit,
                                user: req.user,
                                current_page: 'conf',
                                groups: groups,
                                schools: schools,
                                languages: languages,
                                user_button: req.translationFile.user_button,
                                user_page: req.translationFile.config_user_page,
                                buttons: req.translationFile.buttons
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = function (router, isAuthenticated, isAtLeastOperator) {
    //=========================================================//
    //========================= PARAM =========================//
    //=========================================================//
    router.param("userId", function (req, res, next, userId) {
        if (req.user) {
            var filterString = null;
            // if user is not admin (ie if user is operator)
            if (req.user.GroupId != 1) {
                filterString = {SchoolId: req.user.SchoolId};
            }
            User.findById(userId, filterString, null, function (err, user) {
                if (err) Error.render(err, "conf", req, res);
                else {
                    req.userFromDB = user;
                    return next();
                }
            })
        } else return next();
    });

    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //========================= DISPLAY USER =========================//
    router
        .get("/conf/user/:userId(\\d+)/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
            // render the page
            res.render('conf_userDisplay', {
                user: req.user,
                current_page: 'conf',
                userToEdit: req.userFromDB,
                user_button: req.translationFile.user_button,
                user_page: req.translationFile.config_user_page,
                buttons: req.translationFile.buttons
            });
        })

    //========================= EDIT USER > DISPLAY =========================//
        .get('/conf/user/:userId(\\d+)/edit/', isAuthenticated, function (req, res, next) {
            // check if requested user to display is the same as the current user
            // or if current user is an admin
            if ((req.user.id == req.userFromDB.id) || (isAtLeastOperator)) {
                renderEditUser(null, req.userFromDB, req, res);
            } else {
                res.redirect('/');
            }
        })
    //========================= EDIT USER > SAVE =========================//
        .post("/conf/user/:userId(\\d+)/edit/", isAuthenticated, function (req, res, next) {
            // check if requested user to display is the same as the current user
            // or if current user is an admin
            if ((req.user.id == req.userFromDB.id) || (isAtLeastOperator)) {
                // serialize the user
                var UserSerializer = new User.UserSerializer(req.body);
                // if user is not admin (ie if user is operator), force the SchoolId
                if (req.user.GroupId != 1) {
                    UserSerializer.user.SchoolId = req.user.SchoolId;
                }
                // update the user
                UserSerializer.updateDB(req.userFromDB.id, function (err) {
                    if (err) {
                        renderEditUser(err, UserSerializer.user, req, res);
                    } else {
                        res.redirect('/conf/user/' + req.userFromDB.id + "/");
                    }
                });
            } else {
                res.redirect('/');
            }
        })

    //========================= NEW USER > DISPLAY =========================//
        .get("/conf/user/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
            renderEditUser(null, null, req, res);
        })
    //========================= NEW USER > SAVE =========================//
        .post("/conf/user/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
            // serialize the user
            var userToDB = new User.UserSerializer(req.body);
            // if user is not admin (ie if user is operator)
            if (req.user.GroupId != 1) {
                userToDB.user.GroupId = req.user.SchoolId;
            }
            // update the user
            userToDB.insertDB(function (err) {
                if (err) {
                    renderEditUser(err, userToDB.user, req, res);
                }
                else res.redirect('/conf');
            });
        })

    //========================= DELETE USER =========================//
        .get('/conf/user/delete', isAuthenticated, isAtLeastOperator, function (req, res) {
            if (req.query.hasOwnProperty("id")) {
                var filterString = null;
                // if user is not admin (ie if user is operator)
                if (req.user.GroupId != 1) {
                    filterString = {SchoolId: req.user.SchoolId};
                }
                User.findById(req.query.id, null, filterString, function (err, user) {
                    User.deleteById(user.id, function () {
                        res.redirect("/conf");
                    })
                })
            }
        })
};
