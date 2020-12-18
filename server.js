// Getting the Depandencies

require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieSession = require("cookie-session")

const app = express()

// Getting the local depandencies

const mongoConnect = require("./configs/mongoDB")
require("./services/passport")(passport) // requiring the passport module by exporting the module
const authRoutes = require("./routes/authRoutes");
const newsLetterRoutes = require("./routes/newsLetterRoutes")
const productRoutes = require("./routes/productRoutes")
const userPostRoutes = require("./routes/userPostRoutes")
const getProfileRoutes = require("./routes/getProfilesRoutes")
const createBusinessRoutes = require("./routes/createBusinessRoutes")
const homeScreenRoutes = require("./routes/1.homeScreenRoutes")
// const inputProduct = require("./temp/inputProducts")
// const inputUserPost = require("./temp/inputUserPosts")
// const inputComment = require("./temp/inputComments")


// Middlewares for express

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Connect with the database by calling function from config/mongoDB.js

mongoConnect()

//---------------------------------------------------------------//
// For Authentications
// Setting the cookie using cookie-session module

app.use(cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000, // Cookie will valid for 3 days
    keys: [process.env.COOKEY_KEY]
}))

// Passport middlewares

app.use(passport.initialize());
app.use(passport.session());

//---------------------------------------------------------------//

//---------------------------------------------------------------//
// Calling the Routes
// Calling the auth Routes

app.use(authRoutes)

// Calling the newsletter Routes

app.use(newsLetterRoutes)

// Calling the product Routes

app.use("/products", productRoutes)

// Calling the user post Routes

app.use("/userposts", userPostRoutes)

// calling the get profiles Routes

app.use("/getprofiles", getProfileRoutes)

// calling the create business Routes

app.use("/shifttobusiness", createBusinessRoutes)

// Calling the Screen Routes
// Calling the homeScreenRoters

app.use("/homescreen", homeScreenRoutes)

//---------------------------------------------------------------//

//---------------------------------------------------------------//
// Temp

// inputProduct() // For demo product entry

// inputUserPost() // For demo user input entry

// inputComment() // For demo comment entry

//---------------------------------------------------------------//



// Running the server on port 5000

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port 5000");
})
