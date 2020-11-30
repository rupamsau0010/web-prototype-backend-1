// Require depandencies

const mongoose = require("mongoose")

const userPostsSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    images: [String],
    numOfLike: {
        type: Number,
        default: 0
    },
    numberOfCalling: {
        type: Number,
        default: 0
    },
    originalProductRef: {
        type: String,
        required: true
    },
    postById: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("userpost", userPostsSchema)