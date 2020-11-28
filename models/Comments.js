// Import depandencies

const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    userPostId: {
        type: String,
        required: true
    },
    comments: [{
        maintag: {
            type: String,
            required: true
        },
        maintagBy: {
            type: String,
            required: true
        },
        maintagById: {
            type: String,
            required: true
        }, 
        maintagTime: {
            type: String
        },
        subtag: [{
            subtagStatement: {
                type: String
            },
            subtagStatementBy: {
                type: String
            },
            subtagStatementById: {
                type: String,
                required: true
            },
            subtagTime: {
                type: String
            }
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("comment", commentSchema)