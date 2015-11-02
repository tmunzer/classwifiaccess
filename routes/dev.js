var translate = require('./../translate/translate');

module.exports = function(router, isAuthenticated){
    /* GET Dev tools */
    router.get("/dev", isAuthenticated, function(req, res, next) {
        if (req.user.userGroup == 1) {
            translate(req.user.language, req, function (translationFile) {
                res.render('dev', {
                    user: req.user,
                    user_button: translationFile.user_button
                })
            });
        }
    });
};
