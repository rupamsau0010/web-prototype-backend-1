// Import Depandencies

// Import Local Depandencies

const Product = require("../models/Products");
const UserPost = require("../models/UserPosts");

module.exports.productsAndUserposts_get = async(req, res) => {
    // Get the number of skip...
    let skip = req.params.skip

    // For testing
    const newArray = await Product.find({}).sort({ _id: -1}).limit(6).skip(parseInt(skip))
    const bestArray = await Product.find({}).sort({ numberOfCalling: -1 }).limit(3).skip(parseInt(skip)/2)
    const postArray = await UserPost.find({}).sort({ _id: -1 }).limit(3).skip(parseInt(skip)/2)

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