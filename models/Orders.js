// Import depandencies
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productImg: {
        type: String,
        required: true
    },
    productTitle: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    deliverBy: {
        type: Date,
        required: true
    },
    delivered: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        type: String,
        required: true
    },
    shippingPincode: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    orderDetails: {Object},
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("order", orderSchema)