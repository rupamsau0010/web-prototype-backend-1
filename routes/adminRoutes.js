// Require depandencies
const express = require("express")

const router = express.Router()

// Import Local depandencies
const adminControllers = require("../controllers/adminControllers")

// Get any user by generalUserId(userName) or effcetiveUserId(databaseId)
router.get("/finduser", adminControllers.findUser_get)

// Delete any user based on the data provided(generalUserId or databaseUserId)
router.get("/finduserpost", adminControllers.findUserPost_get)

// Get all the userPosts done bya ny user
router.get("/findalluserposts", adminControllers.findAllUserPosts_get)

// Get the business details of a business user(only by generalUserId(userName))
router.get("/findbusinessuser", adminControllers.findBusinessUser_get)

// Get any products by databaseId or uniqueCode of the product
router.get("/findbusinesspost", adminControllers.findBusinessPost_get)

// Export the module
module.exports = router
