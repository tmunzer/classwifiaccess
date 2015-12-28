var School = require(appRoot + '/models/school');
var Error = require(appRoot + '/routes/error');

module.exports = function (router, isAuthenticated, isAtLeastOperator) {
    /* GET User Display page. */
    router.get("/conf/school/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // save the schoolID requested
        var schoolIdToEdit = req.query.id;
        var filterString = null;
        // if user is not admin (ie if user is operator)
        if (req.user.GroupId != 1) {
            filterString = {SchoolId: req.user.SchoolId};
        }
        // get the school to edit in the DB
        School.findById(schoolIdToEdit, filterString, function (err, schoolToEdit) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                // render the page
                res.render('conf_schoolDisplay', {
                    user: req.user,
                    current_page: 'conf',
                    user_button: req.translationFile.user_button,
                    schoolToEdit: schoolToEdit,
                    school_page: req.translationFile.config_school_page,
                    buttons: req.translationFile.buttons
                });
            }
        });
    });

    /* GET User Edit page. */
    router.get('/conf/school/edit', isAuthenticated, isAtLeastOperator, function (req, res, next) {
        var schoolIdToEdit = req.query.id;
        // if user is admin or if schoolToEdit is the same as the operator's school
        if ((req.user.GroupId == 1) || (req.user.SchoolId == schoolIdToEdit)) {
            // get the school to edit in the DB
            School.findById(schoolIdToEdit, null, function (err, schoolToEdit) {
                if (err) {
                    Error.render(err, "conf", req, res);
                } else {
                    // render the page
                    res.render('conf_schoolEdit', {
                        user: req.user,
                        current_page: 'conf',
                        user_button: req.translationFile.user_button,
                        schoolToEdit: schoolToEdit,
                        school_page: req.translationFile.config_school_page,
                        buttons: req.translationFile.buttons
                    });
                }
            });
        } else {
            res.redirect("back");
        }
    });
    /* POST - SAVE User Edit page. */
    router.post("/conf/school/edit", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        var schoolIdToEdit = req.query.id;
        // if user is admin or if schoolToEdit is the same as the operator's school
        if ((req.user.GroupId == 1) || (req.user.SchoolId == schoolIdToEdit)) {
        // serialize the school
        var SchoolSerializer = new School.SchoolSerializer(req.body);
        // update the user
        SchoolSerializer.updateDB(schoolIdToEdit, function (err) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                res.redirect('/conf/school?id=' + schoolIdToEdit);
            }
        });
        } else {
            res.redirect("back");
        }
    });

    /* GET New User page. */
    router.get("/conf/school/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // Find the language for this user
        // render the page
        res.render('conf_schoolEdit', {
            user: req.user,
            current_page: 'conf',
            user_button: req.translationFile.user_button,
            schoolToEdit: new School(),
            school_page: req.translationFile.config_school_page,
            buttons: req.translationFile.buttons
        });
    });
    /* POST - SAVE New User Edit . */
    router.post("/conf/school/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // serialize the user
        var schoolToDB = new School.SchoolSerializer(req.body);
        // update the school
        schoolToDB.insertDB(function (err) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                res.redirect('/conf');
            }
        });
    });
    router.get('/conf/school/delete', isAuthenticated, isAtLeastOperator, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var schoolId = req.query.id;
            School.deleteById(schoolId, function () {
                res.redirect("/conf");
            })

        }
    })
};
