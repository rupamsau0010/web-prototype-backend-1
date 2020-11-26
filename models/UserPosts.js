// Require depandencies

const mongoose = require("mongoose")

const userPostsSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    images: [String],
    numOfLikes: {
        type: Number,
        default: 0
    },
    numOfCalling: {
        type: Number,
        default: 0
    },
    originalProductRef: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("userpost", userPostsSchema)