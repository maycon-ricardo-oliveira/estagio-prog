module.exports = {

    eBlogger: function(req, res, next) {
        
        if (req.isAuthenticated() && req.user.eAdmin == 2) {

            return next()

        }

        req.flash("error_msg", "Você deve ser Blogger.")
        res.redirect("/")

    }

}