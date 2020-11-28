// Import Depandencies

// Import Local Depandencies
const UserPost = require("../models/UserPosts")
const User = require("../models/Users");
const Comment = require("../models/Comments")

// Get the post of any user by Id

module.exports.userPost_get = async(req, res) => {
    // Get user post id from the req.params
    const userPostId = req.params.id

    const userPost = await UserPost.findById({ _id: userPostId })

    if(userPost){
        // Increase the numberOfCalling (angagement)
        
        let numberOfCalling = userPost.numOfCalling

        numberOfCalling = numberOfCalling + 1
        UserPost.findByIdAndUpdate({ _id: userPostId }, { numOfCalling: numberOfCalling }, function(err1, data1){
            if(!err1) {
                res.json({
                    status: "success",
                    payload: userPost
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...Something went wrong"
                })
            }
        })
    } else {
        res.json({
            status: "failure",
            payload: "Opps...Something went wrong"
        })
    }
}

// Give Like to a particular user post by id

module.exports.giveLikeUserPost_post = async (req, res) => {
    // Get product id
  
    let userPostId = req.params.id;
  
    // Get Messege
  
    const userId = req.body.userId;
    const message = req.body.message;
  
    // Get user post by Id
  
    const userPost = await UserPost.findById({ _id: userPostId });
  
    // do operation based on message
  
    let newLikes = 0;
    if (message === "increment") {
      newLikes = userPost.numOfLike + 1;
  
      // Number of API calling of this particular product (angagement of the userPost)
      let numberOfCalling = userPost.numberOfCalling;
      numberOfCalling = numberOfCalling + 3; // Increment three
  
      // Update the number of likes in the user post
      UserPost.updateOne(
        { _id: userPostId },
        { numOfLike: newLikes, numberOfCalling: numberOfCalling },
        function (err1, data1) {
          if (!err1) {
            User.updateOne({ _id: userId }, { $pull: {likedPost: userPostId}}, function(err2, data2){
                if(!err2){
                    User.updateOne({ _id: userId }, {$push: {likedPost: userPostId}}, function(err3, data3){
                        if(!err3) {
                            res.json({
                                status: "success",
                                payload: null
                            });
                        } else {
                            res.json({
                                status: "failure",
                                payload: "Opps...something went wrong",
                            });
                        }
                    })
                } else {
                    res.json({
                        status: "failure",
                        payload: "Opps...something went wrong",
                    });
                }
            });
          } else {
            res.json({
              status: "failure",
              payload: "Opps...something went wrong",
            });
          }
        }
      );
    } else if (message === "decrement") {
      newLikes = userPost.numOfLike - 1;
  
      // Number of API calling of this particular product (angagement of the product)
      let numberOfCalling = userPost.numberOfCalling;
      numberOfCalling = numberOfCalling - 3; // Increment three
  
      // Update the number of likes in the product
      UserPost.updateOne(
        { _id: userPostId },
        { numOfLike: newLikes, numberOfCalling: numberOfCalling },
        function (err1, data1) {
          if (!err1) {
            // Update the like posts status of the user
            User.updateOne({ _id: userId }, { $pull: {likedPost: userPostId}}, function(err2, data2){
                if(!err2){
                    res.json({
                        status: "success",
                        payload: null
                    })
                } else {
                    res.json({
                        status: "failure",
                        payload: "Opps...something went wrong",
                    });
                }
            });
          } else {
              console.log("from here");
            res.json({
              status: "failure",
              payload: "Opps...Something happened wrong",
            });
          }
        }
      );
    }
};

// Get All comments of a particular user post by id

module.exports.getCommentsUserPost_get = async(req, res) => {
    // Get user post id from the req.params
    let userPostId = req.params.id

    // Find the comments of the particular product by Id

    const userPostComments = await Comment.findOne({ userPostId: userPostId })

    if(userPostComments) {
        res.json({
            status: "success",
            payload: userPostComments
        })
    } else {
        res.json({
            status: "failure",
            payload: "Opps...Something happened wrong."
        })
    }
}

// Make a comment on any post

module.exports.makeMainComment_post = async(req, res) => {
    // Get user post id from the req.params
    let userPostId = req.params.id

    // Get data from req.body
    let maintag = req.body.maintag
    let maintagBy = req.body.maintagBy

    // get post comment's date and time
    let time = new Date()
    let myTime = String(time.getFullYear()) + "-" + String(time.getMonth() + 1) + "-" + String(time.getDate()) + "  " + String(time.getHours()) + ":" + String(time.getMinutes())


    // Find the user post from the comment by userPostId

    const commentAlreadyExists = await Comment.findOne({ userPostId: userPostId })

    if(commentAlreadyExists) {
        // Make main comment sehema 
        const comment = {
            maintag: maintag,
            maintagBy: maintagBy,
            maintagTime: myTime,
            subtag: []
        }
        Comment.findOneAndUpdate({ userPostId: userPostId }, { $push: { comments: comment }}, function(err1, data1){
            if(!err1) {
                res.json({
                    status: "success",
                    payload: null
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...something happened wrong"
                })
            }
        })

    } else {
        // Make a schema for entering comments for the first time in a user post

        const comment = new Comment({
            userPostId: userPostId,
            comments: [
                {
                    maintag: maintag,
                    maintagBy: maintagBy,
                    maintagTime: myTime,
                    subtag: []
                }
            ]
        })

        // Save the data

        comment.save((err, result) => {
            if(!err) {
                res.json({
                    status: "success",
                    payload: null
                })
            } else {
                res.json({
                    status: "failure",
                    payload: null
                })
            }
        })
    }
}

// Delete any comment on any post

module.exports.deleteMainComment_post = async(req, res) => {
    // Get user post id from the req.params
    let userPostId = req.params.id

    // Get comment id and userId from req.body
    let mainCommentId = req.body.mainCommentId
    let userId = req.body.userId
    
    // db.collection.update({"_id":0},{"$pull":{"scores":{score: 6.676176060654615}}})

    Comment.updateOne({ userPostId: userPostId }, {"$pull" : {"comments": {maintagById: userId, _id: mainCommentId}}}, function(err1, data1){
        if(!err1) {
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

}

// Make nested comment on any comment of any post

module.exports.makeNestedComment_post = async(req, res) => {
    // Get user post id from the req.params
    let userPostId = req.params.id
    let mainCommentId = req.params.maincomment

    // Get data from req.body
    let subtagStatement = req.body.subtagStatement
    let subtagStatementBy = req.body.subtagStatementBy

    // console.log(typeof(userPostId), typeof(mainCommentId));

    // get post comment's date and time
    let time = new Date()
    let myTime = String(time.getFullYear()) + "-" + String(time.getMonth() + 1) + "-" + String(time.getDate()) + "  " + String(time.getHours()) + ":" + String(time.getMinutes())


    // Find the user post from the comment by userPostId

    const commentAlreadyExists = await Comment.findOne({ userPostId: userPostId }) 

    if(commentAlreadyExists) {
        // get the comments array  
        subCommentArray = commentAlreadyExists.comments

        // Get the object where where sub-comment will be done
        let i
        let changeObject = {}
        for(i=0; i<subCommentArray.length; i++) {
            if(String(subCommentArray[i]._id) === String(mainCommentId)) {
                changeObject = subCommentArray[i]
            }
        }
        
        // make sub-comment object
        const subtag = {
            subtagStatement: subtagStatement,
            subtagStatementBy: subtagStatementBy,
            subtagTime: myTime
        }
  
        // Push on the subtag array
        changeObject.subtag.push(subtag)

        Comment.updateOne({ userPostId: userPostId, "comments._id": mainCommentId }, { $set: { "comments.$.subtag" : changeObject.subtag }}, function(err1, data1){
            if(!err1) {
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
        res.json({
            status: "failure",
            payload: "Opps...Something happened wrong"
        })
    }
}

// Delete any Nested comment by main comment id and nested comment id

module.exports.deleteNestedComment_post = async(req, res) => {
    // Get data from req.params 

    let userPostId = req.params.id
    let mainCommentId = req.params.maincommentid
    let subCommentId = req.params.subCommentId

    // Get data from req.bady

    let userId = req.body.userId

    // Get the comment data by userPostId
    let data1 = await Comment.findOne({ userPostId: userPostId })
    
    // Change the data
    if(data1) {
        let i, j
        console.log(data1.comments);
        for(i=0; i<data1.comments.length; i++) {
            if (String(data1.comments[i]._id) === String(mainCommentId)) {
                // jsonData1 = data1.comments[i]
                for(j=0; j<data1.comments[i].subtag.length; j++) {
                    if (String(data1.comments[i].subtag[j]._id) === String(subCommentId)) {
                        data1.comments[i].subtag.splice(j, 1)
                    }
                }
            }
        }
        
        // Replace the old data
        Comment.replaceOne({ userPostId: userPostId }, data1, function(err2, data2){
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
        res.json({
            status: "failure",
            payload: "Opps...Something happened wrong"
        })
    }
}

