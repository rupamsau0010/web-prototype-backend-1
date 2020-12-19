// Import Depandencies
const stringSimilarity = require("string-similarity")

// Import Local Depandencies

const Product = require("../models/Products");
const UserPost = require("../models/UserPosts");

// Get General Home Screen Suggestions

module.exports.productsAndUserposts_get = async(req, res) => {
    // Get the number of skip...
    let skip = req.params.skip

    // Get Results from database by query
    const newArray = await Product.find({}).sort({ _id: -1}).limit(6).skip(parseInt(skip))
    const bestArray = await Product.find({}).sort({ numberOfCalling: -1 }).limit(3).skip(parseInt(skip)/2)
    const postArray = await UserPost.find({}).sort({ _id: -1 }).limit(3).skip(parseInt(skip)/2)

    // merget three array result
    let i
    let mainArray = []
    Array.prototype.insert = function ( index, item ) {
        this.splice( index, 0, item );
    };

    for(i=0; i<newArray.length; i++) {
        mainArray.push(newArray[i])
    }
    for(i=0; i<bestArray.length; i++) {
        mainArray.insert((i*2)+1, bestArray[i])
    }
    for(i=0; i<postArray.length; i++) {
        mainArray.insert((i*3)+2, postArray[i])
    }

    if(mainArray.length >= 0) {
        res.json({
            status: "success",
            payload: mainArray
        })
    } else {
        res.json({
            status: "failure",
            payload: "Opps...Something happened wrong"
        })
    }

    // Get the Result from
}

// Get result by searching in the home page(For products and userPosts)

module.exports.suggestionForProductsAndUserPosts_get = async(req, res) => {
    // Get the data from req.body
    const searchGiven = req.body.searchGiven 

    // Get data from req.params
    const numberIn = req.params.numberIn
    const numberOut = req.params.numberOut

    const probability = (val, index) => {
        // console.log(val.tagline);
        // console.log(searchGiven);
        const prob = stringSimilarity.compareTwoStrings(searchGiven.toLowerCase(), val.tagline.toLowerCase());
        return {data: val, value: prob}

    }

    // Query on the database
    const products = await Product.find({}).sort({ _id: -1 })
    const userPosts = await UserPost.find({}).sort({ _id: -1 })

    productArray = products.map(probability)
    userPostArray = userPosts.map(probability)

    productArray.sort(function(first, second){
        return second.value - first.value
    })
    userPostArray.sort(function(first , second){
        return second.value - first.value
    })

    const finalProductArray = productArray.filter(element => element.value >= 0.5)
    const finalUserPostArray = userPostArray.filter(element => element.value >= 0.5)

    // Send the result
    if(finalProductArray.length > 0 || finalUserPostArray.length > 0) {
        res.json({
            status: "success",
            payload: {
                finalProductArray: finalProductArray.slice(numberIn-1, numberOut),
                finalUserPostArray: finalUserPostArray.slice(numberIn-1, numberOut)
            }
        })
    } else {
        res.json({
            status: "failure",
            payload: "Sorry, No match found. Please try another keywords."
        })
    }
}