var User = require(appRoot + "/models/user");
var Group = require(appRoot + "/models/group");
var UILanguage = require(appRoot + '/models/UiLanguage');
var School = require(appRoot + '/models/school');
var Error = require(appRoot + '/routes/error');

function renderEditUser(message, userToEdit, req, res){
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
    /* GET User Display page. */
    router.get("/conf/user/:userId(\\d+)/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // save the userID requested
        var userIdToEdit = req.params.userId;
        var filterString = null;
        // if user is not admin (ie if user is operator)
        if (req.user.GroupId != 1) {
            filterString = {SchoolId: req.user.SchoolId};
        }
        // get the user to edit in the DB
        User.findById(userIdToEdit, filterString, function (err, userToEdit) {
            if (err) {
                Error.render(err, "conf", req, res);
            } else {
                // render the page
                res.render('conf_userDisplay', {
                    user: req.user,
                    current_page: 'conf',
                    userToEdit: userToEdit,
                    user_button: req.translationFile.user_button,
                    user_page: req.translationFile.config_user_page,
                    buttons: req.translationFile.buttons
                });
            }
        });

    });

    /* GET User Edit page. */
    router.get('/conf/user/:userId(\\d+)/edit/', isAuthenticated, function (req, res, next) {
        var userIdToEdit = req.params.userId;

        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (isAtLeastOperator)) {
            // get the user to edit in the DB
            User.findById(userIdToEdit, null, function (err, userToEdit) {
                if (err) Error.render(err, "conf", req, res);
                else {
                    renderEditUser(null, userToEdit, req, res);
                }
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE User Edit page. */
    router.post("/conf/user/:userId(\\d+)/edit/", isAuthenticated, function (req, res, next) {
        var userIdToEdit = req.params.userId;
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        if ((req.user.id == userIdToEdit) || (isAtLeastOperator)) {
            // serialize the user
            var UserSerializer = new User.UserSerializer(req.body);
            // if user is not admin (ie if user is operator)
            if (req.user.GroupId != 1) {
                UserSerializer.user.SchoolId = req.user.SchoolId;
            }
            // update the user
            UserSerializer.updateDB(userIdToEdit, function (err) {
                if (err) {
                    renderEditUser(err, UserSerializer.user, req, res);
                } else {
                    res.redirect('/conf/user/' + userIdToEdit + "/");
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /* GET New User page. */
    router.get("/conf/user/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        renderEditUser(null, null, req, res);
    });
    /* POST - SAVE New User Edit . */
    router.post("/conf/user/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
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
    });
    router.get('/conf/user/delete', isAuthenticated, isAtLeastOperator, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var filterString = null;
            // if user is not admin (ie if user is operator)
            if (req.user.GroupId != 1) {
                filterString = {SchoolId: req.user.SchoolId};
            }
            User.findById(req.query.id, filterString, function (err, user) {
                User.deleteById(user.id, function () {
                    res.redirect("/conf");
                })
            })
        }
    })
};
