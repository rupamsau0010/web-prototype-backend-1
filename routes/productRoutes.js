// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const productControllers = require("../controllers/productControllers")
const { requireAuth } = require("../middlewares/authMiddlewares")

// Get Particular product Route

router.get("/:id", productControllers.product_get)

// Rate the product by particular id

router.post("/:id/giverating", productControllers.giveRating_post)

// Like the product by particular id

router.post("/:id/givelike", productControllers.giveLike_post)

// Add to cart a particular product

router.post("/:id/addtocart", productControllers.addToCart_post)

// EXport the module

module.exports = router
