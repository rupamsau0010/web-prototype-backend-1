// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const getProfileController = require("../controllers/getProfilesControllers")

// Get User profile by id(userId)

router.get("/:id", getProfileController.mainProfileSection_get)

// Get the user's general posts

router.get("/:id/getgeneralposts", getProfileController.userGeneralPosts_get)

// Get business posts by a business users

router.get("/:id/getbusinessposts", getProfileController.userBusinessPost_get)

// Follow or Unfollow any user/business accout

router.post("/:id/followuser", getProfileController.followUser_post)

// Export the Module

module.exports = router