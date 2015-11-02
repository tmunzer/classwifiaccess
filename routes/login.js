var translate = require('./../translate/translate');


module.exports = function(router, passport){
    /* GET login page. */
    router.get('/login', function(req, res) {
        translate(null, req, function(translationFile){
            // Display the Login page with any flash message, if any
            res.render('login', { message: translationFile.login_page[req.flash('message')], text : translationFile.login_page });
        });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));

    /* Handle Logout */
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};
