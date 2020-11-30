// Importing the depandencies...
// Making a simple user Schema in mongoDB...

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    registrationId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    image: {
        type: String,

    },
    profileType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    follower: {
        count: {type: Number, default: 0},
        followers: [String]
    },
    following: {
        count: {type: Number, default: 0},
        followings: [String]
    },
    likedPost: [String],
    posts: [String],
    cart: [String]
});

module.exports = mongoose.model("user", userSchema);