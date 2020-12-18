// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const homeScreenControllers = require("../controllers/1.homeScreenControllers")

router.get("/:skip", homeScreenControllers.productsAndUserposts_get)

// Export the router

module.exports = router