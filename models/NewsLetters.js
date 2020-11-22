// Importing the depandencies...
// Making a simple user Schema in mongoDB...

const mongoose = require("mongoose")

const newsLetterSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("newsletter", newsLetterSchema)

