// Import Depandencies...

// Middleware for Protecting routes...
const requireAuth = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect("/auth/google");
    }
}

module.exports = { requireAuth };