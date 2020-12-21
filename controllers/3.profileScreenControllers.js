// Import Depandencies
const { v4: uuidv4 } = require("uuid");

// Import Local Depandencies

const User = require("../models/Users");
const s3 = require("../services/aws-S3")

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

// Update profile data(profile image)

module.exports.updateProfileImage_post = async(req, res) => {
    // Get data from req.params

    // Get Data from req.body
    const userId = req.body.userId
    const item = req.file

    // Find the user in the database
    const user = await User.findById({_id: userId })
    
    // Get the existing image url
    existingImageUrl = user.image

    // Check the data from AWS or not
    if(existingImageUrl.slice(0, 31) === "https://salt-ecosystem-web-1.s3") {
        const imgName = existingImageUrl.split("/")[4]

        s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `businessUserImages/${imgName}`
        },function (err,data){
            if(!err) {
                
                let myFile1 = item.originalname.split(".");
                const fileType1 = myFile1[myFile1.length - 1];

                var params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    ContentType: "image/jpg",
                    Key: `businessUserImages/${uuidv4()}.${fileType1}`,
                    Body: item.buffer,
                }

                s3.upload(params, function (err1, data1) {
                    if (err1) {
                        res.json({
                            status: "failure",
                            payload: "Opps...Something happened wrong"
                        })
                    } else {

                        User.findByIdAndUpdate({_id: userId}, {image: data1.Location}, {new: true}, async function(err2, data2){
                            if(data2) {
                                res.json({
                                    status: "success",
                                    payload: data2.image
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.json({
                    status: "failure",
                    payload: "Opps...Something happened wrong"
                })
            }
        })
    } else {

        let myFile1 = item.originalname.split(".");
        const fileType1 = myFile1[myFile1.length - 1];

        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            ContentType: "image/jpg",
            Key: `businessUserImages/${uuidv4()}.${fileType1}`,
            Body: item.buffer,
        }

        s3.upload(params, function (err1, data1) {
            if (err1) {
                res.json({
                    status: "failure",
                    payload: "Opps...Something happened wrong"
                })
            } else {
                User.findByIdAndUpdate({_id: userId}, {image: data1.Location}, {new: true}, function(err2, data2){
                    if(data2) {
                        res.json({
                            status: "success",
                            payload: data2.image
                        })
                    }
                })
            }
        })
    }
}

// Delete profile image

module.exports.deleteProfileImage_post = async(req, res) => {
    // Get data from req.params

    // Get data from req.body
    const userId = req.body.userId

    const sampleImage = "https://salt-ecosystem-web-1.s3.ap-south-1.amazonaws.com/generalProfileImage.PNG"

    // Find the user and delete the profile image(update to sample Image)
    User.findByIdAndUpdate({_id: userId}, {image: sampleImage}, {new: true}, function(err1, data1){
        if(!err1) {
            res.json({
                status: "success",
                payload: data1.image
            })
        } else {
            res.json({
                status: "failure",
                payload: "Opps...Something happened wrong"
            })
        }
    })
}

module.exports.userPosts_post = async(req, res) => {
    // Get data from req.params
    
    // Get Data from req.body
    const userId = req.body.userId
    const files = req.files

    console.log(files);

    // Will implement the code after doing any order... it will be see automatecally
}

