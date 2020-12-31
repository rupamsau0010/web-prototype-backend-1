// This is only for the the admin pannels for accessing the database
// No access for the general users

// Import depandencies

// Import local depandencies
const User = require("../models/Users")

// Get the user by generalUserId(googleId or facebookId; userName) or databaseUserId(userId or effective userId)
module.exports.findUser_get = async(req, res) => {
    // Get data from req.params

    // Get the generalUserId or databaseUserId
    // Get data from req.body
    const userId = req.body.userId
    
    User.findOne({userName: userId}, function(err1, data1){
        if(data1 && !err1) {
            res.json({
                status: "success",
                payload: data1
            })
        } else if(!data1 && !err1) {
            User.findById({_id: userId}, function(err2, data2){
                if(data2 && !err2) {
                    res.json({
                        status: "success",
                        payload: data2
                    })
                } else {
                    res.json({
                        status: "failure",
                        payload: "UserNot founf"
                    })
                }
            })
        }
    })
}
