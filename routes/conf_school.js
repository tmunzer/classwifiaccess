var School = require(appRoot + '/models/school');
var Error = require(appRoot + '/routes/error');

function renderEditSchool(message, schoolToEdit, req, res) {
    res.render('conf_schoolEdit', {
        user: req.user,
        current_page: 'conf',
        user_button: req.translationFile.user_button,
        message: message,
        schoolToEdit: schoolToEdit,
        school_page: req.translationFile.config_school_page,
        buttons: req.translationFile.buttons
    });
}

module.exports = function (router, isAuthenticated, isAtLeastOperator) {
    //=========================================================//
    //========================= PARAM =========================//
    //=========================================================//
    router.param("schoolId", function (req, res, next, schoolId) {
        if (req.user) {
            var filterSchoolString = null;
            // if user is not admin (ie if user is operator)
            if (req.user.GroupId != 1) {
                filterSchoolString = {id: req.user.SchoolId};
            }
            // get the school to edit in the DB
            School.findById(schoolId, filterSchoolString, null, function (err, school) {
                if (err) {
                    Error.render(err, "conf", req, res);
                } else {
                    req.schoolFromDB = school;
                    return next();
                }
            })
        } else return next()
    });

    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //========================= DISPLAY SCHOOL =========================//
    router.get("/conf/school/:schoolId(\\d+)/$", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // render the page
        res.render('conf_schoolDisplay', {
            user: req.user,
            current_page: 'conf',
            user_button: req.translationFile.user_button,
            schoolToEdit: req.schoolFromDB,
            school_page: req.translationFile.config_school_page,
            buttons: req.translationFile.buttons
        });

    });

    //========================= EDIT SCHOOL > DISPLAY =========================//
    router.get('/conf/school/:schoolId(\\d+)/edit/$', isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // if user is admin or if schoolToEdit is the same as the operator's school
        if ((req.user.GroupId == 1) || (req.user.SchoolId == req.schoolFromDB.id)) {
            // render the page
            renderEditSchool(null, req.schoolFromDB, req, res);
        } else {
            res.redirect("back");
        }
    });
    //========================= EDIT SCHOOL > SAVE =========================//
    router.post("/conf/school/:schoolId(\\d+)/edit/$", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // if user is admin or if schoolToEdit is the same as the operator's school
        if ((req.user.GroupId == 1) || (req.user.SchoolId == req.schoolFromDB.id)) {
            // serialize the school
            var SchoolSerializer = new School.SchoolSerializer(req.body);
            // update the user
            SchoolSerializer.updateDB(req.schoolFromDB.id, function (err) {
                if (err) {
                    renderEditSchool(err, SchoolSerializer.school, req, res);
                } else {
                    res.redirect('/conf/school/' + req.schoolFromDB.id + "/");
                }
            });
        } else {
            res.redirect("back");
        }
    });

    //========================= NEW SCHOOL > DISPLAY =========================//
    router.get("/conf/school/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // render the page
        renderEditSchool(null, new School(), req, res);
    });

    //========================= NEW SCHOOL > SAVE =========================//
    router.post("/conf/school/new/", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // serialize the user
        var SchoolSerializer = new School.SchoolSerializer(req.body);
        // update the school
        SchoolSerializer.insertDB(function (err) {
            if (err) {
                renderEditSchool(err, SchoolSerializer.school, req, res);
            } else {
                res.redirect('/conf');
            }
        });
    });

    //========================= DELETE SCHOOL =========================//
    router.get('/conf/school/delete', isAuthenticated, isAtLeastOperator, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var schoolId = req.query.id;
            School.deleteById(schoolId, function () {
                res.redirect("/conf");
            })

        }
    })
};
