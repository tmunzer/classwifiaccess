var express = require('express');
var router = express.Router();
var Api = require("../bin/models/account");

var School = require("../bin/models/school");


router.get('/', function(req, res, next) {
    if (req.session.passport) {
        if (req.session.passport.user.GroupId.value <= 2){
            School.getAll(null, function (err, schoolList) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    res.render('web-app', {
                        title: 'ClassWifiAccess',
                        schoolList: schoolList,
                        redirectUrl: Api.getRedirectUrl(),
                        clientId: Api.getClientId(),
                        GroupId: req.session.passport.user.GroupId,
                        schoolId: 0
                    });
                }
            });
        } else {
                res.render('web-app', {
                    title: 'ClassWifiAccess',
                    schoolList: {},
                    redirectUrl: Api.getRedirectUrl(),
                    clientId: Api.getClientId(),
                    GroupId: req.session.passport.user.GroupId,
                    schoolId: 0
                });
            }
    } else res.redirect("/login/");
});
module.exports = router;