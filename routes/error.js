
module.exports.render = function(error, currentPage, req) {
    res.render("error", {
        current_page: currentPage,
        error: err,
        user: req.user,
        session: req.session,
        user_button: req.translationFile.user_button
    });
}