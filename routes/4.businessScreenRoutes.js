// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const businessScreenControllers = require("../controllers/4.businessScreenControllers")
const uploadProfileImage = require("../services/multerForProfileImage")

// Update the business user details(image)
/// Besically using uploadProfileImage multer configuration for uploading single image in all the condition
router.post("/updatebusinessimage", uploadProfileImage,  businessScreenControllers.updateBusinessImage_post) 

// Update the business user details(except image)

router.post("/updatebusinessdetails", businessScreenControllers.updateBusinessDetails_post)

// Export the router

module.exports = router