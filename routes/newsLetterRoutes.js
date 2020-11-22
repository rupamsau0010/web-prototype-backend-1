// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const newsLetterControllers = require("../controllers/newsLetterControllers")

// Newsletter post Route

router.post("/newsletter", newsLetterControllers.newsLetter_post)

// Export the Module

module.exports = router