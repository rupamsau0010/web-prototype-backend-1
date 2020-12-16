// Import depandencies
const AWS = require("aws-sdk")

// AWS s3 setup
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

// Export s3
module.exports = s3