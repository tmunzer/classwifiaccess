const express = require('express');
const router = express.Router();

const School = require("../bin/models/school");

//===============================================================//
//============================ settings SCHOOLS===========================//
//===============================================================//

//========================== GET SCHOOLS ===========================//
router.get("/", function (req, res, next) {
    if (req.session.passport) {
        let filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId.value > 1) filterString = { id: req.session.passport.user.SchoolId };
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = { id: req.query.schoolId };
        School.findAll(filterString, null, function (err, schools) {
            if (err) res.json({ error: err });
            else res.json({ schools: schools });
        });
    } else res.status(403).send('Unknown session');
});
//========================== CREATE/UPDATE SCHOOL ===========================//
router.post("/", function (req, res, next) {
    let school;
    if (req.session.passport) {
        if (req.body.schoolId && req.body.schoolId > 1 && req.body.school) {
            school = req.body.school;
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId.value > 1) school._id = req.session.passport.user.SchoolId;
            // update the user
            School.update({ _id: school._id }, { $set: school }, function (err) {
                if (err) res.json({ error: err });
                else res.json({});
            });
        } else if (req.body.school) {
            school = req.body.school;
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId.value > 1) school._id = req.session.passport.user.SchoolId;
            // update the school
            School(school).save(function (err) {
                if (err) res.json({ error: err });
                else res.json({});
            });
        }
    } else res.status(403).send('Unknown session');
});
//========================== DELETE SCHOOL ===========================//
router.delete('/', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            const schoolId = req.query.id;
            School.remove({ _id: schoolId }, function (err) {
                if (err) res.json({ error: err });
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;