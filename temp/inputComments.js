// Import Depandencies

const mongoose = require("mongoose")
const express = require("express")

const app = express()

// Import local depandencies

const Comment = require("../models/Comments")

// Import default middlewares

app.use(express.json())


const saveComment = () => {
    let time = new Date()

    let myTime = String(time.getFullYear()) + "-" + String(time.getMonth() + 1) + "-" + String(time.getDate()) + "  " + String(time.getHours()) + ":" + String(time.getMinutes())

    // console.log(myTime);

    const comment = new Comment({
        userPostId: "5ff142d40ea0993f90031348",
        comments: [
            {
                maintag: "This is main tag 1",
                maintagBy: "maintagby - 1",
                maintagById: "5fbce458ab4372504810b467",
                maintagLike: 0,
                maintagTime: myTime,
                subtag: [
                    {
                        subtagStatement: "This is subtag 1",
                        subtagStatementBy: "subtag - 1",
                        subtagStatementById: "5fbce458ab4372504810b467",
                        subtagStatementLike: 0,
                        subtagTime: myTime
                    },
                    {
                        subtagStatement: "This is subtag 2",
                        subtagStatementBy: "subtag - 2",
                        subtagStatementById: "5fbce458ab4372504810b467",
                        subtagStatementLike: 0,
                        subtagTime: myTime
                    }
                ]
            },
            {
                maintag: "This is main tag 2",
                maintagBy: "maintagby - 2",
                maintagById: "5fbce458ab4372504810b467",
                maintagLike: 0,
                maintagTime: myTime,
                subtag: [
                    {
                        subtagStatement: "This is subtag 3",
                        subtagStatementBy: "subtag - 3",
                        subtagStatementById: "5fbce458ab4372504810b467",
                        subtagStatementLike: 0,
                        subtagTime: myTime
                    },
                    {
                        subtagStatement: "This is subtag 4",
                        subtagStatementBy: "subtag - 4",
                        subtagStatementById: "5fbce458ab4372504810b467",
                        subtagStatementLike: 0,
                        subtagTime: myTime
                    }
                ]
            }
        ]
    })

    comment.save((err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    })
}

module.exports = saveComment





// Get the sub-comment array
// subCommentArray = commentAlreadyExists.comments
        
// let i
// let changeObject = {}
// for(i=0; i<subCommentArray.length; i++) {
//     if(String(subCommentArray[i]._id) === String(mainCommentId)) {
//         changeObject = subCommentArray[i]
//     }
// }

// const comment = {
//     maintag: maintag,
//     maintagBy: maintagBy,
//     maintagTime: myTime,
//     subtag: []
// }

// changeObject.subtag.push(comment)

// Comment.findOneAndDelete({ comments: { _id: mainCommentId }}, function(err1, data1){
//     if(!err1) {
//         Comment.add
//     }
// })