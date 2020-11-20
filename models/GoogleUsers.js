// Importing the depandencies...
//Making a simple user Schema in mongoDB...

const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
    googleId: {
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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("googleuser", googleUserSchema);