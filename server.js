// Getting the Depandencies

require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieSession = require("cookie-session")

// Getting the local depandencies

const mongoConnect = require("./configs/mongoDB")

const app = express()

// Middlewares for express

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Connect with the database by calling function from config/mongoDB.js

mongoConnect()

// Running the server on port 5000

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port 5000");
})
