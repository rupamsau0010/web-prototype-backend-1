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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);