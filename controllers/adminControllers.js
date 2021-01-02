// This is only for the the admin pannels for accessing the database
// No access for the general users

// Import depandencies

// Import local depandencies
const User = require("../models/Users");
const BusinessUser = require("../models/BusinessUserDetails");
const UserPost = require("../models/UserPosts");
const Comment = require("../models/Comments");
const Product = require("../models/Products");
const s3 = require("../services/aws-S3");

// Get the user by generalUserId(googleId or facebookId; userName) or databaseUserId(userId or effective userId)
module.exports.findUser_get = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId or databaseUserId
  // Get data from req.body
  const userId = req.body.userId;

  User.findOne({ userName: userId }, function (err1, data1) {
    if (data1 && !err1) {
      res.json({
        status: "success",
        payload: data1,
      });
    } else if (!data1 && !err1) {
      User.findById({ _id: userId }, function (err2, data2) {
        if (data2 && !err2) {
          res.json({
            status: "success",
            payload: data2,
          });
        } else {
          res.json({
            status: "failure",
            payload: "UserNot founf",
          });
        }
      });
    }
  });
};

// Get the business details of the business user
module.exports.findBusinessUser_get = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userId = req.body.userId;

  // Get the userId
  const user = await User.findOne({ userName: userId });

  if (user) {
    const id = user._id;
    BusinessUser.findOne({ mainUserId: id }, function (err1, data1) {
      if (data1 && !err1) {
        res.json({
          status: "success",
          payload: data1,
        });
      } else {
        res.json({
          status: "failure",
          payload: "Business user details Not found",
        });
      }
    });
  } else {
    res.json({
      status: "failure",
      payload: "User details Not found",
    });
  }
};

// Get general userPost by databaseId or uniqueCo
module.exports.findUserPost_get = async(req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userPostId = req.body.userPostId

  UserPost.findById({_id: userPostId}, function(err1, data1){
    if(data1 && !err1) {
      res.json({
        status: "success",
        payload: data1
      })
    } else {
      res.json({
        status: "failure",
        payload: "UserPost not found"
      })
    }
  })
}