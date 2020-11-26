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
        userPostId: "5fbf25324200ed4488d4f48d",
        comments: [
            {
                maintag: "This is main tag 1",
                maintagBy: "maintagby - 1",
                maintagTime: myTime,
                subtag: [
                    {
                        subtagStatement: "This is subtag 1",
                        subtagStatementBy: "subtag - 1",
                        subtagTime: myTime
                    },
                    {
                        subtagStatement: "This is subtag 2",
                        subtagStatementBy: "subtag - 2",
                        subtagTime: myTime
                    }
                ]
            },
            {
                maintag: "This is main tag 2",
                maintagBy: "maintagby - 2",
                maintagTime: myTime,
                subtag: [
                    {
                        subtagStatement: "This is subtag 3",
                        subtagStatementBy: "subtag - 3",
                        subtagTime: myTime
                    },
                    {
                        subtagStatement: "This is subtag 4",
                        subtagStatementBy: "subtag - 4",
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