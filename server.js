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
// const inputProduct = require("./temp/inputProducts")
// const inputUserPost = require("./temp/inputUserPosts")
const inputComment = require("./temp/inputComments")


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

//---------------------------------------------------------------//

//---------------------------------------------------------------//
// Temp

// inputProduct() // For demo product entry

// inputUserPost() // For demon user input entry

inputComment()

//---------------------------------------------------------------//



// Running the server on port 5000

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port 5000");
})
