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
const { route } = require("../routes/adminRoutes");

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
module.exports.findUserPost_get = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userPostId = req.body.userPostId;

  UserPost.findById({ _id: userPostId }, function (err1, data1) {
    if (data1 && !err1) {
      res.json({
        status: "success",
        payload: data1,
      });
    } else {
      res.json({
        status: "failure",
        payload: "UserPost not found",
      });
    }
  });
};

// Get products by the business users by databaseId(productId) or uniqueCode
module.exports.findBusinessPost_get = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const id = req.body.id;

  Product.findOne({ uniqueCode: id }, function (err1, data1) {
    if (data1 && !err1) {
      res.json({
        status: "success",
        payload: data1,
      });
    } else {
      Product.findById({ _id: id }, function (err2, data2) {
        if (data2 && !err2) {
          res.json({
            status: "success",
            payload: data2,
          });
        } else {
          res.json({
            status: "failure",
            payload: "Product coundn't be found.",
          });
        }
      });
    }
  });
};

// Get all the userPosts done by any user
module.exports.findAllUserPosts_get = async (req, res) => {
  // Get data from req.params

  // Get the databaseUserId of any user
  // Get data from req.body
  const userId = req.body.userId;

  UserPost.find({ postById: userId }, function (err1, data1) {
    if (data1 && data1.length > 0 && !err1) {
      res.json({
        status: "success",
        payload: data1,
      });
    } else if (data1 && data1.length <= 0 && !err1) {
      res.json({
        status: "success",
        payload: "This user doesnot posted anything yet or User doesn't exists",
      });
    } else {
      res.json({
        status: "failure",
        payload: "Opps...something happened wrong",
      });
    }
  });
};

// Get all the business post done by any user
module.exports.findAllBusinessPosts_get = async (req, res) => {
  // Get data from req.params

  // Get the databaseUserId of any user
  // Get data from req.body
  const userId = req.body.userId;

  Product.find({ postById: userId }, function (err1, data1) {
    if (data1 && data1.length > 0 && !err1) {
      res.json({
        status: "success",
        payload: data1,
      });
    } else if (data1 && data1.length <= 0 && !err1) {
      res.json({
        status: "success",
        payload:
          "This user doesnot posted any Product yet or User doesn't exists",
      });
    } else {
      res.json({
        status: "failure",
        payload: "Opps...something happened wrong",
      });
    }
  });
};

// Convert the the databaseId to generalUserId(userName) or vice varsa
module.exports.convertids_get = async (req, res) => {
  // Get data from req.params

  // Get the databaseUserId of any user
  // Get data from req.body
  const userId = req.body.userId;

  User.findOne({ userName: userId }, function (err1, data1) {
    if (data1 && !err1) {
      res.json({
        status: "success",
        payload: data1._id,
      });
    } else if (!data1 && !err1) {
      User.findById({ _id: userId }, function (err2, data2) {
        if (data2 && !err2) {
          res.json({
            status: "success",
            payload: data2.userName,
          });
        } else {
          res.json({
            status: "failure",
            payload: "User not found.",
          });
        }
      });
    }
  });
};

// Delete any userPosts done by general users
module.exports.deleteUserPost_post = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userPostId = req.body.userPostId;

  UserPost.findByIdAndDelete({ _id: userPostId }, function (err1, data1) {
    if (data1 && !err1) {
      var count = 0;
      data1.images.map((item) => {
        const imgName = item.split("/")[4];
        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `userPosts/${imgName}`,
          },
          function (err2, data2) {
            if (data1) {
              count += 1;

              if (count == data1.images.length) {
                Comment.findOneAndDelete(
                  { userPostId: data1._id },
                  function (err3, data3) {
                    if (data3 && !err3) {
                      res.json({
                        status: "success",
                        payload: "UserPost deleted successfully",
                      });
                    } else if (!data3 && !err3) {
                      res.json({
                        status: "success",
                        payload: "UserPost deleted successfully",
                      });
                    } else if (err3) {
                      res.json({
                        status: "failure",
                        payload: "Opps...Something happened wrong.",
                      });
                    }
                  }
                );
              }
            } else {
              res.json({
                status: "failure",
                payload: "Opps...Something happened wrong.",
              });
            }
          }
        );
      });
      if (data1.images.length <= 0) {
        res.json({
          status: "success",
          payload: "Userpost deleted successfully",
        });
      }
    } else {
      res.json({
        status: "failure",
        payload:
          "Opps...Something happened wrong or Userpost couldn't be found",
      });
    }
  });
};

// Delete any businesspost done by any businessUser
module.exports.deleteBusinessPost_post = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const productId = req.body.productId;

  Product.findByIdAndDelete({ _id: productId }, function (err1, data1) {
    if (data1 && !err1) {
      var count = 0;
      data1.image.map((item) => {
        const imgName = item.split("/")[4];
        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `businessPosts/${imgName}`,
          },
          function (err2, data2) {
            if (data1) {
              count += 1;

              if (count == data1.image.length) {
                res.json({
                  status: "success",
                  payload: "UserPost deleted successfully",
                });
              }
            } else {
              res.json({
                status: "failure",
                payload: "Opps...Something happened wrong.",
              });
            }
          }
        );
      });
      if (data1.images.length <= 0) {
        res.json({
          status: "success",
          payload: "Userpost deleted successfully",
        });
      }
    } else {
      res.json({
        status: "failure",
        payload:
          "Opps...Something happened wrong or Userpost couldn't be found",
      });
    }
  });
};

// Get all comments of any product by admin
module.exports.getComments_get = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userPostId = req.body.userPostId;

  Comment.findOne({ userPostId: userPostId }, function (err1, data1) {
    if (data1 && !err1) {
      res.json({
        status: "success",
        payload: data1,
      });
    } else if (!data1 && !err1) {
      res.json({
        status: "success",
        payload: "No comments in this post still now.",
      });
    } else if (err1) {
      res.json({
        status: "failure",
        payload: "Opps...Something happened wrong",
      });
    }
  });
};

//Delete main comment of any userPosts by the admin
module.exports.deleteMainComment_post = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userPostId = req.body.userPostId;
  const mainCommentId = req.body.mainCommentId;

  Comment.findOneAndUpdate(
    { userPostId: userPostId },
    { $pull: { comments: { _id: mainCommentId } } },
    { new: true },
    function (err1, data1) {
      if (!err1 && data1) {
        res.json({
          status: "success",
          payload: data1,
        });
      } else {
        console.log(err1);
        res.json({
          status: "failure",
          payload: "Opps...Something happened wrong.",
        });
      }
    }
  );
};

// Delete any subComment of any comment of any UserPosts by the admin
module.exports.deleteSubComment_post = async (req, res) => {
  // Get data from req.params

  // Get the generalUserId(not by usind databaseId)
  // Get data from req.body
  const userPostId = req.body.userPostId;
  const mainCommentId = req.body.mainCommentId;
  const subCommentId = req.body.subCommentId;

  // Get the comment data by userPostId
  let data1 = await Comment.findOne({ userPostId: userPostId });

  // Change the data
  if (data1) {
    let i, j;
    console.log(data1.comments);
    for (i = 0; i < data1.comments.length; i++) {
      if (String(data1.comments[i]._id) === String(mainCommentId)) {
        // jsonData1 = data1.comments[i]
        for (j = 0; j < data1.comments[i].subtag.length; j++) {
          if (
            String(data1.comments[i].subtag[j]._id) === String(subCommentId)
          ) {
            data1.comments[i].subtag.splice(j, 1); 
          }
        }
      }
    }
    // Replace the old data
    Comment.replaceOne({ userPostId: userPostId }, data1, {new: true}, function(err2, data2){
      if(data2 && !err2) {
        res.json({
          status: "success",
          payload: data1
        })
      } else {
        res.json({
          status: "failure",
          payload: data2
        })
      }
    })
  }
};
