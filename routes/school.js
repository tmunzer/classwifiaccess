var School = require('./../models/school');

module.exports = function (router, isAuthenticated) {
    /* GET User Display page. */
    router.get("/school/", isAuthenticated, function (req, res, next) {
        // save the schoolID requested
        var schoolIdToEdit = req.query.id;
        // check if current user is an admin
        if (req.session.isAdmin) {
            // get the school to edit in the DB
            School.findById(schoolIdToEdit, null, function (err, schoolToEdit) {
                // render the page
                res.render('schoolDisplay', {
                    user: req.user,
                    user_button: req.translationFile.user_button,
                    schoolToEdit: schoolToEdit,
                    school_page: req.translationFile.school_page,
                    buttons: req.translationFile.buttons
                });

            });
        } else {
            res.redirect('/');
        }
    });

    /* GET User Edit page. */
    router.get('/school/edit', isAuthenticated, function (req, res, next) {
        var schoolIdToEdit = req.query.id;
        // check if current user is an admin
        if (req.session.isAdmin) {
            // get the school to edit in the DB
            School.findById(schoolIdToEdit, null, function (err, schoolToEdit) {
                // render the page
                res.render('schoolEdit', {
                    user: req.user,
                    user_button: req.translationFile.user_button,
                    schoolToEdit: schoolToEdit,
                    school_page: req.translationFile.school_page,
                    buttons: req.translationFile.buttons
                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE User Edit page. */
    router.post("/school/edit", isAuthenticated, function (req, res, next) {
        var schoolIdToEdit = req.query.id;
        // check if current user is an admin
        if (req.session.isAdmin) {
            // serialize the school
            var SchoolSerializer = new School.SchoolSerializer(req.body);
            // update the user
            SchoolSerializer.updateDB(schoolIdToEdit, function (err) {
                res.redirect('/school?id=' + schoolIdToEdit);
            });
        } else {
            res.redirect('/');
        }
    });

    /* GET New User page. */
    router.get("/school/new/", isAuthenticated, function (req, res, next) {
        // check if current user is an admin
        if (req.session.isAdmin) {
            // Find the language for this user
            // render the page
            res.render('schoolEdit', {
                user: req.user,
                user_button: req.translationFile.user_button,
                schoolToEdit: new School(),
                school_page: req.translationFile.school_page,
                buttons: req.translationFile.buttons
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE New User Edit . */
    router.post("/school/new/", isAuthenticated, function (req, res, next) {
        // check if current user is an admin
        if (req.session.isAdmin) {
            // serialize the user
            var schoolToDB = new School.SchoolSerializer(req.body);
            // update the school
            schoolToDB.insertDB(function (err) {
                res.redirect('/conf');
            });
        } else {
            res.redirect('/');
        }
    });
    router.get('/school/delete', isAuthenticated, function (req, res) {
        if (req.session.isAdmin) {
            if (req.query.hasOwnProperty("id")) {
                var schoolId = req.query.id;
                School.deleteById(schoolId, function () {
                    res.redirect("/conf");
                })

            }
        } else {
            res.redirect("/conf");
        }
    })
};
