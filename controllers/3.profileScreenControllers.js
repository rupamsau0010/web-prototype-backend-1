// Import Depandencies
const { v4: uuidv4 } = require("uuid");

// Import Local Depandencies

const User = require("../models/Users");
const Product = require("../models/Products")
const UserPost = require("../models/UserPosts")
const Order = require("../models/Orders")
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

// Create an user Post

module.exports.userPosts_post = async(req, res) => {
    // Get data from req.params
    
    // Get Data from req.body
    const userId = req.body.userId
    const file = req.files
    const caption = req.body.caption
    const originalProductRef = req.body.originalProductRef

    // Find the original product
    const product = await Product.findOne({uniqueCode: originalProductRef})
    const user = await User.findById({_id: userId})

    // If the product has been ordered by the user
    if(product && user.orderUniqueCodes.includes(product.uniqueCode)) {
        s3.createBucket(function(){
            var ResponseData = []
            file.map((item) => {
                let myFile1 = item.originalname.split(".");
                const fileType1 = myFile1[myFile1.length - 1];
        
                var params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    ContentType: "image/jpg",
                    Key: `userPosts/${uuidv4()}.${fileType1}`,
                    Body: item.buffer,
                };
        
                s3.upload(params, function (err, data) {
                    if (err) {
                        res.json({ error: true, Message: err });
                    } else {
                        ResponseData.push(data.Location);
        
                        // Check all the images has been uploaded or not
                        if (ResponseData.length == file.length) {
                            const userPost = new UserPost({
                                caption: caption,
                                images: ResponseData,
                                originalProductRef: originalProductRef,
                                postById: userId,
                                tagline: product.tagline
                            })

                            userPost.save((err1, data1) => {
                                if(data1 && !err1) {
                                    res.json({
                                        status: "success",
                                        payload: data1
                                    })
                                } else {
                                    res.json({
                                        status: "failure",
                                        payload: "Opps...Something happened wrong"
                                    })
                                }
                            })
                        }
                    }
                })
            })
        })
    } else {
        res.json({
            status: "failure",
            payload: "Sorry...How can you show off your friends before buying the product. Please consider buying first"
        })
    }
    // Will implement the code after doing any order... it will be see automatecally
}


// Update an user post(without image as image can't be updated)

module.exports.updateUserPosts_post = async(req, res) => {
    // Get data from req.params
    const userPostId = req.params.userPostId

    // Get data from req.body
    const userId = req.body.userId
    const caption = req.body.caption

    // Update the data
    UserPost.findOneAndUpdate({_id: userPostId, postById: userId }, {caption: caption}, {new: true}, function(err1, data1){
        if(!err1 && data1) {
            res.json({
                status: "success",
                payload: data1
            })
        } else {
            console.log(data1);
            console.log(err1);
            res.json({
                status: "failure",
                payload: "Opps...Something went wrong"
            })
        }
    })
}

// Delete an userPost

module.exports.deleteUserPosts_post = async(req, res) => {
    // Get data from req.params
    const userPostId = req.params.userPostId

    // Get data from req.body
    const userId = req.body.userId

    // Delete the userPost
    UserPost.findOneAndDelete({_id: userPostId, postById: userId}, function(err1, data1){
        if(!err1 && data1) {
            res.json({
                status: "success",
                payload: "Data deleted successfully"
            })
        } else {
            res.json({
                status: "failure",
                payload: "Opps...Something went wrong"
            })
        }
    })
}

// Get the all the post in the user cart

module.exports.myCart_get = async(req, res) => {
    // Get data from req.params

    // Get data from req.body
    const userId = req.body.userId

    // Get the user data
    const user = await User.findById({_id: userId})

    var i = 0, myCart = [], count = 0;
    for(i=0; i<user.cart.length; i++) {
        Product.findById({_id: user.cart[i]}, function(err1, data1){
            count += 1
            if(data1 && !err1) {
                myCart.push(data1)
            }
            if(count == user.cart.length && myCart.length > 0) {
                res.json({
                    status: "success",
                    payload: myCart
                })
            } else if(count == user.cart.length && myCart.length <= 0) {
                res.json({
                    status: "success",
                    payload: "Your cart is empty"
                })
            }
        })
    }
}

// Get all the products from an user's order

module.exports.myOder_get = async(req, res) => {
    // Get data from req.params

    // Get data from req.body
    const userId = req.body.userId

    // Get the user data
    const user = await User.findById({_id: userId})

    var i = 0, myOrders = [], count = 0;
    for(i=0; i<user.orders.length; i++) {
        Order.findById({_id: user.orders[i]}, function(err1, data1){
            count += 1
            if(data1 && !err1) {
                myOrders.push(data1)
            }
            if(count == user.orders.length && myOrders.length > 0) {
                res.json({
                    status: "success",
                    payload: myOrders
                })
            } else if(count == user.orders.length && myOrders.length <= 0) {
                res.json({
                    status: "success",
                    payload: "You don't made any order still now."
                })
            }
        })
    }
}