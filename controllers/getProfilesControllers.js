// Import Depandencies

// Import Local Depandencies

const e = require("express");
const Product = require("../models/Products");
const UserPost = require("../models/UserPosts")
const User = require("../models/Users");

// Get the general/business user profile (basic)

module.exports.mainProfileSection_get = async(req, res) => {
    // Get values from req.params
    targetUserId = req.params.id

    // Get values from req.body

    // Find the user/business profile by id
    User.findById({ _id: targetUserId }, function(err1, data1){
        if(!err1) {
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

// Get the general posts done by any user (general/business)
// Will be called from the frontend after getting getting basic profile datas(automatically)

module.exports.userGeneralPosts_get = async(req, res) => {
    // Get values from req.params
    targetUserId = req.params.id

    // Get values from req.body

    // Get the user's general posts

    UserPost.find({ postById: targetUserId }, function(err1, data1){
        if(!err1) {
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

// Get the Business posts done by only business users
// Will be called from the frontend after getting getting basic profile datas(manually by the users)

module.exports.userBusinessPost_get = async(req, res) => {
    // Get values from req.params
    targetUserId = req.params.id

    // Get values from req.body

    // First check the user actually a business user or not
    
    User.findById({ _id: targetUserId }, function(err1, data1){
        if(!err1 && data1.profileType === "business") {
            Product.find({ postById: targetUserId }, function(err2, data2){
                if(!err2) {
                    res.json({
                        status: "success",
                        payload: data2
                    })
                } else {
                    res.json({
                        status: "failure",
                        payload: data2
                    })
                }
            })
        } else if(!err1 && data1.profileType === "general") {
            res.json({
                status: "success",
                payload: "This is not a Business profile. Find Business profiles for Shopping."
            })
        } else {
            res.json({
                status: "failure",
                payload: "Opps...Something happened wrong"
            })
        }
    })
}

// Follow or unFollow any general/business user page

module.exports.followUser_post = async(req, res) => {
    // Get values from req.params
    targetUserId = req.params.id

    // Get values from req.body
    userId = req.body.userId
    message = req.body.message

    // check the state 
    if(message === "follow") {
        User.findByIdAndUpdate({ _id: userId }, {$inc: {"following.count": 1}, $push: {"following.followings": targetUserId}}, function(err1, data1){
            if(!err1) {
                User.findByIdAndUpdate({_id: targetUserId }, {$inc: {"follower.count": 1}, $push: {"follower.followers": userId}}, function(err2, data2){
                    if(!err2) {
                        res.json({
                            status: "success",
                            payload: null
                        })
                    } else {
                        res.json({
                            status: "failure",
                            payload: "Opps...Something happened wrong"
                        })
                    }
                })
            } else {
                console.log(err1);
                res.json({
                    status: "failure",
                    payload: "Opps...Something happened wrong"
                })
            }
        })
    } else if(message === "unfollow") {
        User.findByIdAndUpdate({ _id: userId }, {$inc: {"following.count": -1}, $pull: {"following.followings": targetUserId}}, function(err1, data1){
            if(!err1) {
                User.findByIdAndUpdate({_id: targetUserId }, {$inc: {"follower.count": -1}, $pull: {"follower.followers": userId}}, function(err2, data2){
                    if(!err2) {
                        res.json({
                            status: "success",
                            payload: null
                        })
                    } else {
                        res.json({
                            status: "failure",
                            payload: "Opps...Something happened wrong"
                        })
                    }
                })
            } else {
                console.log(err1);
                res.json({
                    status: "failure",
                    payload: "Opps...Something happened wrong"
                })
            }
        })
    } else {
        res.json({
            status: "failure",
            payload: "Opps...Something happened wrong"
        })
    }
}
