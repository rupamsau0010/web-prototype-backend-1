// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const userPostController = require("../controllers/userPostControllers")

// Get an user post by Id

router.get("/:id", userPostController.userPost_get)

// Like an user post

router.post("/:id/givelike", userPostController.giveLikeUserPost_post)

// Get all the comments of a particular post by Id

router.get("/:id/getcomments", userPostController.getCommentsUserPost_get)

// Give main comments

router.post("/:id/givemaincomment", userPostController.makeMainComment_post)

// Give sub-comment by main comment object id

router.post("/:id/givesubcomment/:maincomment", userPostController.makeNestedComment_post)

// Delete main Comments by userId and mainCommentId

router.post("/:id/deletemaincomment/:maincommentid", userPostController.deleteMainComment_post)

// Delete a sub-comment by userId, mainCommentId & subCommentId

router.post("/:id/deletesubcomment/:maincommentid/:subcommentid", userPostController.deleteNestedComment_post)

// Like Main comment by userId & message on the payload

router.post("/:id/likemaincomment/:maincomment", userPostController.likeMainComment_post)

// Like Nested comment by userId & message on the payload

router.post("/:id/likenestedcomment/:maincomment/:subcomment", userPostController.likeNestedComment_post)

// Export router

module.exports = router