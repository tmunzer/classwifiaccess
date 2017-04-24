
module.exports.render = function(error, currentPage, req, res) {
    console.info("\x1b[32minfo\x1b[0m:",error);
    res.render("error", {
        current_page: currentPage,
        error: error,
        user: req.user,
        session: req.session
    });
};