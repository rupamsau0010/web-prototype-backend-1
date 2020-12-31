// Require depandencies
const express = require("express")

const router = express.Router()

// Import Local depandencies
const adminControllers = require("../controllers/adminControllers")

// Get any user by generalUserId(userName) or effcetiveUserId(databaseId)
router.get("/finduser", adminControllers.findUser_get)

// Delete any user based on the data provided(generalUserId or databaseUserId)
router.post("/deleteuser", adminControllers.deleteUser_post)

// Export the module
module.exports = router
