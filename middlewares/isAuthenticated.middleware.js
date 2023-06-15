const isAuthenticated = (req, res, next) => {
    if (req.session.authUser) {
        return next();
    }
    return res.redirect('/login');
}

module.exports = isAuthenticated;