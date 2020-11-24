// Importing the depandencies...


// Controllers Functions
// Auth Google
module.exports.authGoogle_get = () => {
    
}

// Auth Facebook
module.exports.authFacebook_get = () => {
    
}

// Auth Google Callback
module.exports.authGoogleCallback_get = (req, res) => {
    res.json({
        status: "success",
        payload: {
            displayName: req.user.displayName,
            usedId: req.user._id,
            firstName: req.user.displayName.split(" ")[0]
        }
    })
}

// Auth Facebook Callback
module.exports.authFacebookCallback_get = (req, res) => {
    res.json({
        status: "success",
        payload: {
            displayName: req.user.displayName,
            usedId: req.user._id,
            firstName: req.user.displayName.split(" ")[0]
        }
    })
}

// Login Get
module.exports.authLogin_get = (req, res) => {
    res.send("Auth Using Google || Auth Using Facebook")
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