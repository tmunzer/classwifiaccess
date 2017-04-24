var express = require('express');
var router = express.Router();

var User = require("../bin/models/user");
var Group = require("../bin/models/userGroup");


//===============================================================//
//============================ settings USERS===========================//
//===============================================================//

//========================== GET info for the current connected user ===========================//

router.get("self", function (req, res, next) {
    if (req.session.passport) {
        res.json({
            uid: req.session.passport.user.id,
            gid: req.session.passport.user.GroupId
        });
    } else res.status(403).send('Unknown session');
});
//========================== GET my account info ===========================//
router.get("/myAccount", function (req, res, next) {
    if (req.session.passport) {
            User.findOne({id: req.session.passport.user.id}, null, function (err, myAccount) {
                if (err) res.json({error: err});
                else res.json({myAccount: myAccount});
            });
    } else res.status(403).send('Unknown session');
});
//========================== GET USERS list ===========================//
router.get("/", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        User.findAll(filterString, null, function (err, users) {
            if (err) res.json({error: err});
            else res.json({users: users});
        });
    } else res.status(403).send('Unknown session');
});

//========================== GET GROUPS list ===========================//
router.get("/groups", function (req, res, next) {
    if (req.session.passport) {
        Group.findAll({id: [">=", req.session.passport.user.GroupId]}, null, function (err, groups) {
            if (err) res.json({error: err});
            else res.json({groups: groups});
        });
    } else res.status(403).send('Unknown session');
});

//========================= NEW USER > SAVE =========================//
router.post("/", function (req, res, next) {
    var userToDB;
    if (req.session.passport && req.body.user) {
        if (req.body.userId && req.body.userId > 1) {
            if ((req.session.passport.user.id == req.body.userId) || (req.session.passport.user.GroupId <= 2)) {
                // serialize the user
                userToDB = new User.UserSerializer(req.body.user);
                // if user is not admin (ie if user is operator), force the SchoolId
                if (req.session.passport.user.GroupId != 1) userToDB.user.SchoolId = req.session.passport.user.SchoolId;
                // update the user
                userToDB.updateDB(req.body.userId, function (err) {
                    if (err) res.json({error: err});
                    else res.json({});
                });
            }
            else res.json({error: "You don't have enough privilege"});
        } else {
            // serialize the user
            userToDB = new User.UserSerializer(req.body.user);
            // if user is not admin (ie if user is operator)
            if (req.session.passport.user.GroupId != 1) userToDB.user.SchoolId = req.session.passport.user.SchoolId;
            userToDB.user.LanguageId = "0";
            // update the user
            userToDB.insertDB(function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        }
    }
});

//========================= DELETE USER =========================//
router.delete('/', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var userId = req.query.id;
            User.deleteById(userId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;