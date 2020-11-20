// Require depandencies

const express = require("express")
const passport = require("passport")

const router = express.Router()

// Require local depandencies

const { requireAuth } = require("../middlewares/authMiddlewares")
const authController = require("../controllers/authControllers")

router.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }), authController.authGoogle_get);
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authController.authGoogleCallback_get);
router.get("/", authController.home_get);
router.get("/secret", requireAuth, authController.secret_get);  // Using requireAuth Middleware function...
router.get("/currect_user", requireAuth, authController.current_user_get); // Using requireAuth Middleware function...
router.get("/logout", authController.logout_get);

module.exports = router;
