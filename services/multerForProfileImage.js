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
const uploadProfileImage = multer({storage}).single("profileImage")

// Export upload
module.exports = uploadProfileImage

