// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const businessScreenControllers = require("../controllers/4.businessScreenControllers")
const uploadProfileImage = require("../services/multerForProfileImage")

// Update the business user details(image)

router.post("/updatebusinessimage", uploadProfileImage,  businessScreenControllers.updateBusinessImage_post)

// Export the router

module.exports = router