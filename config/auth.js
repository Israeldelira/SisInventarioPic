module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'Por favor inicia sesion');
            res.redirect('/users/login');
        }
    }
}