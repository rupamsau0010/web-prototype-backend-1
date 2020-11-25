// Require depandencies
const mongoose = require("mongoose")

const countSchema = new mongoose.Schema({
    productCount: {
        type: Number,
        default: 0
    },
    userCount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("count", countSchema)