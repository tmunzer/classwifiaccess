var express = require('express');
var router = express.Router();


var Classroom = require('../bin/models/classroom');
//===============================================================//
//============================ settings CLASS===========================//
//===============================================================//
router.get("/", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId.value > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        Classroom.find(filterString, null, function (err, classrooms) {
            if (err) res.json({error: err});
            else res.json({classrooms: classrooms});
        });
    } else res.status(403).send('Unknown session');
});
module.exports = router;