// Import Depandencies

// Import Local Depandencies

const Product = require("../models/Products")
const User = require("../models/Users")

// Get a Particular product by Id

module.exports.product_get = async(req, res) => {
    const productId = req.params.id
    
    // Get the actual product
    const product = await Product.findById(productId)

    //const product = getProduct(productId)

    // Number of API calling of this particular product
    let numberOfCalling = product.numberOfCalling
    numberOfCalling = numberOfCalling + 1 // Increment one

    if(product) {
        //Update the numberOfCalling API of this particular product
        Product.updateOne({ _id: productId }, { numberOfCalling: numberOfCalling }, function(err, data){
            if(err) {
                console.log("Error");
            } else {
                console.log("Success");
            }
        })

        // Get the similar products
        const similarProducts = await Product.find({ $and: [{ catagory: product.catagory, _id: { $ne: productId }}]}).sort({ _id: -1 }).limit(10)

        // Get more products from the same store
        const moreProducts = await Product.find({ $and: [{ brandNameOrShopName: product.brandNameOrShopName, _id: {$ne: productId}}]}).sort({ _id: -1 }).limit(10)

        if(similarProducts) {

            if (moreProducts) {
                res.json({
                    status: "success",
                    payload: [product, similarProducts, moreProducts]
                })
            } else {
                res.json({
                    status: "success",
                    payload: [product, similarProducts]
                })
            }

        } else {

            if (moreProducts) {
                res.json({
                    status: "success",
                    payload: [product, moreProducts]
                })
            } else {
                res.json({
                    status: "success",
                    payload: [product]
                })
            }
        }
    } else {
        res.json({
            status: "failure",
            payload: null
        })
    }
}

// Give rating of a particular product

module.exports.giveRating_post = async(req, res) => {
    // Get productId and rating from the API

    let productId = req.params.id
    let userId = req.body.userId
    let rating = req.body.rating

    // First find the user already have given a rating in the particular item or not

    const ratingAlreadyExists = await Product.find({ $and: [{ _id: productId , ratingGivenBy: { $elemMatch: {userId: userId}} }]})

    // if rating already exists

    if(ratingAlreadyExists.length !== 0) {
        let arrayOfRatings = ratingAlreadyExists[0].ratingGivenBy

        let x
        for (x of arrayOfRatings) {
            if(x.userId === userId) {
                givenRating = x.rating
            }
        }

        const product = await Product.findById(productId)

        // Number of API calling of this particular product (angagement of the product)
        let numberOfCalling = product.numberOfCalling
        numberOfCalling = numberOfCalling + 2 // Increment two

        // Get product rating and numberOfRating

        let productRating = product.rating
        let numberOfRating = product.numOfRating

        if (rating <= 3) { rating === 3}

        console.log(productRating, numberOfRating, givenRating, rating);

        let newRating = Math.round(((((productRating * numberOfRating) - givenRating) + rating) / numberOfRating) * 10) / 10 // Get rounded number one digit after point 

        Product.updateOne({ _id: productId, "ratingGivenBy.userId": userId }, { rating: newRating, numOfRating: numberOfRating, numberOfCalling: numberOfCalling, $set: { "ratingGivenBy.$.rating": rating }}, function(err, data){
            if(err) {
                res.json({
                    status: "failure",
                    payload: "Internal server error. Please try again."
                })
            } else {
                res.json({
                    status: "Success",
                    payload: null
                })
            }
        })

        
    } else {
        // Get product by Id

        const product = await Product.findById(productId)

        // Get product rating and numberOfRating

        let productRating = product.rating
        let numberOfRating = product.numOfRating

        if (rating <= 3) { rating === 3}

        let newRating = Math.round(((productRating * numberOfRating) + rating) / (numberOfRating + 1) * 10) / 10 // Get rounded number one digit after point
    
        let newNumberOfRating = numberOfRating + 1

        Product.updateOne({ _id: productId }, { rating: newRating, numOfRating: newNumberOfRating, $push: { ratingGivenBy: { rating: rating, userId: userId }}}, function(err, data){
            if(err) {
                res.json({
                    status: "failure",
                    payload: "Internal server error. Please try again."
                })
            } else {
                res.json({
                    status: "Success",
                    payload: null
                })
            }
        })
    }
}

// Like a particular product

module.exports.giveLike_post = async(req, res) => {
    // Get product id

    let productId = req.params.id

    // Get Messege
    
    const userId = req.body.userId
    const message = req.body.message

    // Get product by Id

    const product = await Product.findById(productId)


    // do operation based on message
    
    let newLikes = 0
    if (message === "increment") {
        newLikes = product.numOfLike + 1

        // Number of API calling of this particular product (angagement of the product)
        let numberOfCalling = product.numberOfCalling
        numberOfCalling = numberOfCalling + 3 // Increment three

        // Update the number of likes in the product
        Product.updateOne({ _id: productId }, { numOfLike: newLikes, numberOfCalling: numberOfCalling }, function(err1, data1){
            if(!err1) {
                User.updateOne({ _id: userId }, { $push : {likedPost: product}}, function(err2, data2){
                    if(!err2) {
                        res.json({
                            status: "success",
                            payload: null
                        })
                    } else {
                        res.json({
                            status: "failure",
                            payload: "Opps...something went wrong"
                        })
                    }
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...something went wrong"
                })
            }
        })
    } else if (message === "decrement") {
        newLikes = product.numOfLike - 1

        // Number of API calling of this particular product (angagement of the product)
        let numberOfCalling = product.numberOfCalling
        numberOfCalling = numberOfCalling - 3 // Increment three

        // Update the number of likes in the product
        Product.updateOne({ _id: productId }, { numOfLike: newLikes, numberOfCalling: numberOfCalling }, function(err1, data1){
            if(!err1) {

                // Update the like posts status of the user
                User.findOne({ _id: userId }, function(err, data){
                    if(data){
                        let i
                        for(i=0; i<data.likedPost.length; i++){
                            if(data.likedPost[i]._id == productId){
                                // console.log(data.likedPost[i]._id);
                                data.likedPost.splice(i)
                            }
                        }
                        // console.log(data.likedPost); 
                        User.updateOne({ _id: userId }, { likedPost: data.likedPost}, function(err, data){
                            if(err){
                                res.json({
                                    status: "failure",
                                    payload: "Opps...Something happened wrong"
                                })
                            } else {
                                res.json({
                                    status: "success",
                                    payload: null
                                })
                            }
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
        })
    }
}

// Add a product to Cart

module.exports.addToCart_post = async(req, res) => {
    // Get product id

    let productId = req.params.id

    // Get Messege
    
    const userId = req.body.userId
    const message = req.body.message

    // Get product by Id

    const product = await Product.findById(productId)

    // do operation based on message
    
    if (message === "add") {

        // Update the cart array of the user (addtocart)
    
        User.updateOne({ _id: userId }, { $push : {cart: product}}, function(err2, data2){
            if(!err2) {
                res.json({
                    status: "success",
                    payload: null
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...something went wrong"
                })
            }
        })

    } else if (message === "remove") {

        // Update the cart array of the user (removefromthecart)

        User.findOne({ _id: userId }, function(err, data){
            if(data){
                let i
                for(i=0; i<data.cart.length; i++){
                    if(data.cart[i]._id == productId){
                        // Remove that item
                        data.cart.splice(i)
                    }
                }
                
                User.updateOne({ _id: userId }, { cart: data.cart}, function(err, data){
                    if(err){
                        res.json({
                            status: "failure",
                            payload: "Opps...Something happened wrong"
                        })
                    } else {
                        res.json({
                            status: "success",
                            payload: null
                        })
                    }
                })
            } else {
                res.json({
                    status: "failure",
                    payload: "Opps...Something happened wrong"
                })
            }
        })
    }
}


