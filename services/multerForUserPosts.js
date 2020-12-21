// Import depandencies
const multer = require("multer")

// Upload images using multer
// Multer storage
const storage = multer.memoryStorage({
    destination: function(req, file, callback){
        callback(null, "")
    }
})

// Multer middleware
const uploadUserPosts = multer({storage}).array("userPosts")

// Export upload
module.exports = uploadUserPosts

