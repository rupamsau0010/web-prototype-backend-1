// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const homeScreenControllers = require("../controllers/1.homeScreenControllers")

// Get the suggestion from HomeScreen

router.get("/suggestions/:skip", homeScreenControllers.productsAndUserposts_get)

// Get the search result from HomeScreen

router.get("/search/:numberIn/:numberOut", homeScreenControllers.suggestionForProductsAndUserPosts_get)

// Export the router

module.exports = router