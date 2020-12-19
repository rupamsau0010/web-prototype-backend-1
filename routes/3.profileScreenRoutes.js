// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const profileScreenControllers = require("../controllers/3.profileScreenControllers")

// Follow or unfollow any user accout

router.post("/followorunfollow/:targetId", profileScreenControllers.followOrUnfollow_post)

// Export the module

module.exports = router