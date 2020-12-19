// Import Depandencies

// Import Local Depandencies

const User = require("../models/Users");

// Follow or unfollow any user accout

module.exports.followOrUnfollow_post = async(req, res) => {
    // Get target profile id from req.params
    targetId = req.params.targetId

    // Get userId and message from req.body
    userId = req.body.userId
    message = req.body.message

    // Find the target profile and update
    // if message is to follow

    if (message === "follow") {
        User.findByIdAndUpdate({_id: targetId}, {$push: {"follower.followers": userId}, $inc: {"follower.count": 1}}, function(err1, data1){
            if(data1) {
                // Find the user profile and update
                User.findByIdAndUpdate({_id: userId}, {$push: {"following.followings": targetId}, $inc: {"following.count": 1}}, function(err2, data2){
                    if(data2) {
                        res.json({
                            status: "success",
                            payload: null
                        })
                    } else {
                        res.json({
                            status: "failure",
                            payload: "Opps...Something went wrong."
                        })
                    }
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...Something went wrong."
                })
            }
        })
    } else if(message === "unfollow"){
        User.findByIdAndUpdate({_id: targetId}, {$pull : {"follower.followers": userId}, $inc: {"follower.count": -1}}, function(err1, data1){
            if(data1) {
                // Find the user profile and update
                User.findByIdAndUpdate({_id: userId}, {$pull: {"following.followings": targetId}, $inc: {"following.count": -1}}, function(err2, data2){
                    if(data2) {
                        res.json({
                            status: "success",
                            payload: null
                        })
                    } else {
                        res.json({
                            status: "failure",
                            payload: "Opps...Something went wrong."
                        })
                    }
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...Something went wrong."
                })
            }
        })
    }
}

// Update my profile(all except img)

module.exports.updateProfile_post = async(req, res) => {
    // Get data from req.params

    // Get data from req.body
    const userId = req.body.userId
    const name = req.body.name
    const userName = req.body.userName
    const email = req.body.email
    const phoneNo = req.body.phoneNo
    const gender = req.body.gender
    const deliveryLandmark = req.body.deliveryLandmark
    const deliveryPincode = req.body.deliveryPincode

    const payloadData = {
        userId: userId,
        displayName: name,
        userName: userName,
        email: email,
        phoneNo: phoneNo,
        gender: gender,
        deliveryLandmark: deliveryLandmark,
        deliveryPincode: deliveryPincode
    }

    User.findByIdAndUpdate({_id: userId}, {displayName: name, userName: userName, email: email, phoneNo: phoneNo, gender: gender, deliveryLandmark: deliveryLandmark, deliveryPincode: deliveryPincode}, function(err1, data1){
        if(data1) {
            res.json({
                status: "success",
                payload: {
                    message: "Data updated successfully",
                    data: payloadData
                }
            })
        } else {
            res.json({
                status: "failure",
                payload: "Opps...Something happened wrong"
            })
        }
    })
}