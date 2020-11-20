// Importing the depandencies...


// Controllers Functions
module.exports.authGoogle_get = () => {
    
}

module.exports.authGoogleCallback_get = (req, res) => {
    res.redirect("/secret");
}

module.exports.home_get = (req, res) => {
    res.send("You are in the Home page");
}

module.exports.secret_get = (req, res) => {
    res.send("This is our little Secret. You must be autherticated.");
}

module.exports.current_user_get = (req, res) => {
    res.send(req.user);
}

module.exports.logout_get = (req, res) => {
    req.logout();
    res.redirect("/");
}