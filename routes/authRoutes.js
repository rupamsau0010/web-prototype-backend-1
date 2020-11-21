// Require depandencies

const express = require("express")
const passport = require("passport")

const router = express.Router()

// Require local depandencies

const { requireAuth } = require("../middlewares/authMiddlewares")
const authController = require("../controllers/authControllers")

// Google Routes

router.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }), authController.authGoogle_get);
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authController.authGoogleCallback_get);

// Facebook Routes

router.get("/auth/facebook", passport.authenticate("facebook", { scope: "email, public_profile"}), authController.authFacebook_get);
router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), authController.authFacebookCallback_get);

// General Tests Routes (For Auth)
router.get("/", authController.home_get);
router.get("/login", authController.authLogin_get)
router.get("/secret", requireAuth, authController.secret_get);  // Using requireAuth Middleware function...
router.get("/current_user", requireAuth, authController.current_user_get); // Using requireAuth Middleware function...
router.get("/logout", authController.logout_get);

module.exports = router;
