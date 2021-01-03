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

// Get all the business Posts done by any business user
router.get("/findallbusinessposts", adminControllers.findAllBusinessPosts_get)

// Convert the the databaseId to generalUserId(userName) or vice varsa
router.get("/converids", adminControllers.convertids_get)

// Delete any userPost by databaseId
router.post("/deleteuserpost", adminControllers.deleteUserPost_post)

// Delete any businessPost(product) by databaseId
router.post("/deletebusinesspost", adminControllers.deleteBusinessPost_post)

// Get comments from any post by userPostId
router.get("/getcomments", adminControllers.getComments_get)

// Delete mainComment by userPostId and mainCommentId
router.post("/deletemaincomment", adminControllers.deleteMainComment_post)

// Delete subcomment by userPostId and mainCommentId and subCommentId
router.post("/deletesubcomment", adminControllers.deleteSubComment_post)

// Export the module
module.exports = router
