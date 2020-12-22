// Import depandencies
const mongoose = require("mongoose")

// This schema will be changed based on the avaliablity of the type of prosucts

const productCountSchema = new mongoose.Schema({
    gar: {
        type: Number,
        default: 0
    },
    sho: {
        type: Number,
        default: true
    }
})

module.exports = mongoose.model("productcount", productCountSchema)