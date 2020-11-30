// Import Depandencies

const mongoose = require("mongoose")
const express = require("express")

const app = express()

// Import local depandencies

const UserPost = require("../models/UserPosts")

// Import default middlewares

app.use(express.json())

const images = ["https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg"]

const saveUserPost = () => {
    const userpost = new UserPost({
        caption: "This is my number 3 post",
        images: images,
        numOfLike: 0,
        numberOfCalling: 0,
        postById: "5fbce458ab4372504810b467",
        originalProductRef: "HGT138"
    })

    userpost.save((err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    })
}

module.exports = saveUserPost