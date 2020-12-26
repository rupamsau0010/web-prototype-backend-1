// Import depandencies
const express = require("express")
const router = express.Router()

// Import local depandencies
const orderControllers = require("../controllers/orderControllers")

// Update the user data(phoneNo, deliveryLandmark, deliveryPincode) before order
router.post("/updateaddress", orderControllers.preOrderAddress_post)

// Get payment from the user
router.post("/razorpay", orderControllers.razorpay_post)

// Export the module
module.exports = router