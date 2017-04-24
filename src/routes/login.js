var express = require('express');
var router = express.Router();
var passport = require('passport');


/* GET login page. */
router.get('/', function (req, res) {
    if (req.isAuthenticated())
        res.redirect('/web-app/');
    // if the user is not authenticated then redirect him to the login page
    else res.render('login', {
        title: 'ClassWifiAccess Login'
    });
});

/* Handle Login POST */
router.post('/', passport.authenticate('login', {
        successRedirect: '/web-app/',
        failureRedirect: '/login/',
        failureFlash: true
    })
);

/* Handle Logout */
router.get('/logout/', function (req, res) {
    console.info("\x1b[32minfo\x1b[0m:","User " + req.user.username + " is now logged out.");
    req.logout();
    req.session.destroy();
    res.redirect('/login/');
});


module.exports = router;
