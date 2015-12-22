
module.exports.render = function(error, currentPage, req, res) {
    res.render("error", {
        current_page: currentPage,
        error: error,
        user: req.user,
        session: req.session,
        user_button: req.translationFile.user_button
    });
};