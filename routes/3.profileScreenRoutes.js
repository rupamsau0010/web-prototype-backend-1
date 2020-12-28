// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const profileScreenControllers = require("../controllers/3.profileScreenControllers")
const uploadProfileImage = require("../services/multerForProfileImage")
const uploadUserPosts = require("../services/multerForUserPosts")

// Follow or unfollow any user accout

router.post("/followorunfollow/:targetId", profileScreenControllers.followOrUnfollow_post)

// Update profile data (except profile img)

router.post("/updateprofile", profileScreenControllers.updateProfile_post)

// Upade profile image

router.post("/updateprofileimage", uploadProfileImage, profileScreenControllers.updateProfileImage_post)

// Delete the user's profile image

router.post("/deleteprofileimage", profileScreenControllers.deleteProfileImage_post)

// create user Posts

router.post("/userposts", uploadUserPosts, profileScreenControllers.userPosts_post)

// Update an userPost

router.post("/updateuserpost/:userPostId", profileScreenControllers.updateUserPosts_post)

// Delete an userPost

router.post("/deleteuserpost/:userPostId", profileScreenControllers.deleteUserPosts_post)


// Export the module

module.exports = router