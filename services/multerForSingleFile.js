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
const uploadSingleFile = multer({storage}).fields([{name: "panCardImg", maxCount: 1}, {name: "businessImg", maxCount: 1}])

// Export upload
module.exports = uploadSingleFile

