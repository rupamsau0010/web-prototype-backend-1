// Import Depandencies

// Import Local Depandencies

const Product = require("../models/Products")

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
    let rating = req.body.rating

    // Get product by Id

    const product = await Product.findById(productId)

    // Get product rating and numberOfRating

    let productRating = product.rating
    let numberOfRating = product.numOfRating

    if (rating <= 3) { rating === 3}

    let newRating = Math.round(((productRating * numberOfRating) + rating) / (numberOfRating + 1) * 10) / 10 // Get rounded number one digit after point
    
    let newNumberOfRating = numberOfRating + 1

    Product.updateOne({ _id: productId }, { rating: newRating, numOfRating: newNumberOfRating }, function(err, data){
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

// Like a particular product

module.exports.giveLike_post = async(req, res) => {
    // Get product id

    let productId = req.params.id

    // Get Messege

    const message = req.body.message

    // Get product by Id

    const product = await Product.findById(productId)

    // do operation based on message
    
    let newLikes = 0
    if (message === "increment") {
        newLikes = product.numOfLike + 1
    } else if (message === "decrement") {
        newLikes = product.numOfLike - 1
    }

    // Update the number of likes in the product

    Product.updateOne({ _id: productId }, { numOfLike: newLikes }, function(err, data){
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


