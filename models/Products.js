// Require depandencies
const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brandNameOrShopName: {
        type: String,
        required: true
    },
    uniqueCode: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
    image: [String],
    price: {
        type: Number,
        required: true
    },
    size: [String],
    color: [String],
    rating: {
        type: Number,
        default: 4.5
    },
    numOfRating: {
        type: Number,
        default: 12
    },
    ratingGivenBy: {
        type: [Object]
    },
    numOfLike: {
        type: Number,
        default: 0
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    deliveryAtSingleTime: {
        type: Number,
        required: true
    },
    timeOfDelivery: {
        type: Number,
        required: true
    },
    numberOfCalling: {
        type: Number,
        default: 0
    },
    offer: [
        {
            offerTitle: { type: String, required: true },
            offerStatement: { type: String, required: true }
        }
    ],
    description: [
        {
            descriptionTitle: { type: String, required: true },
            descriptionStatement: { type: String, required: true }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("product", productSchema)