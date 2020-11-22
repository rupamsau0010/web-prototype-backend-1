// Import Depandencies

const validator = require("email-validator");
const mongoose = require("mongoose")

// Import Local Depandencies

const NewsLetter = require("../models/NewsLetters")

// NewsLetter Post

module.exports.newsLetter_post = (req, res) => {
    // Take email from the frontend
    const email = req.body.email

    // Chack the email is valid or not
    const isValid = validator.validate(email)

    if(isValid) {
        // Check the Email is already exists on the Database or not
        NewsLetter.find({ emailId: email }, (err, docs) => {
            if (err) {
                res.json({
                    status: "failure",
                    payload: "Internal Server error. Please try again later."
                })
            } else {
                if (docs.length === 0) {
                    const newsLetterUser = new NewsLetter({
                        emailId: email
                    })
                    newsLetterUser.save((err, result) => {
                        if(err) {
                            res.json({
                                status: "failure",
                                payload: "Internal Server error. Please try again later."
                            })
                        } else {
                            res.json({
                                status: "success",
                                payload: "Yor are now connected with our latest Newsletters."
                            })
                        }
                    })        
                } else {
                    res.json({
                        status: "failure",
                        payload: "You are already connected with our latest Newsletters."
                    })
                }
            }
        })
    } else {
        res.json({
            status: "failure",
            payload: "Please enter a correct email Id."
        })
    }
}