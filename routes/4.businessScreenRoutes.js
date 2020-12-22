// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const businessScreenControllers = require("../controllers/4.businessScreenControllers")
const uploadProfileImage = require("../services/multerForProfileImage")
const uploadUserPosts = require("../services/multerForUserPosts")

// Update the business user details(image)
/// Besically using uploadProfileImage multer configuration for uploading single image in all the condition
router.post("/updatebusinessimage", uploadProfileImage,  businessScreenControllers.updateBusinessImage_post) 

// Update the business user details(except image)

router.post("/updatebusinessdetails", businessScreenControllers.updateBusinessDetails_post)

// Create a business post
/// Besically using uploadUserPosts multer configuration for uploading multiple img files at a same time
router.post("/createbusinesspost", uploadUserPosts, businessScreenControllers.createBusinessPost_post)

// Make a post as a out of stock
router.post("/productstatus", businessScreenControllers.productStatusUpdate_post)

// Update the business posts (products) details(without image)
router.post("/updateproductdetails", businessScreenControllers.updateProductDetails_post)

// Delete a business post(product)
router.post("/deleteproduct", businessScreenControllers.deleteProducts_post)

// Export the router

module.exports = router