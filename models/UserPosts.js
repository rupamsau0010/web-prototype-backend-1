// Require depandencies

const mongoose = require("mongoose")

const userPostsSchema = new mongoose.Schema({
    title: {
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
    }
})

module.exports = mongoose.model("userpost", userPostsSchema)