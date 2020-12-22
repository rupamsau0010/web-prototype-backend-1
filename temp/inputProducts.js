// Import Depandencies

const mongoose = require("mongoose")
const express = require("express")

const app = express()

// Import local depandencies

const Product = require("../models/Products")

// Import default middlewares

app.use(express.json())

const images = ["https://i.gadgets360cdn.com/products/cameras/large/1548234910_832_nikon_d7200-24-2mp-dslr-camera.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2iIo0bky991hwKYYKznxeVyKyAVajse7T2g&usqp=CAU"]

const sizes = [null]

const colors = ["black"]

const offers = [
    {
        offerTitle: "Axis Bank Credit or Debit Card",
        offerStatement: "Extra 10% off"
    },
    {
        offerTitle: "Paytm",
        offerStatement: "Extra 5% off"
    }
]

const descriptions = [
    {
        descriptionTitle: "Material",
        descriptionStatement: "Pure Leather"
    }
]

const saveProduct = () => {
    const product = new Product({
        name: "Sport Shoes for men",
        brandNameOrShopName: "HARPAL",
        catagory: "Shoes",
        tagline: "Shoes for men and women",
        postById: "wrong//When Business User Will Be created Then It Will Come",
        image: images,
        price: 5000,
        size: sizes,
        color: colors,
        rating: 4.8,
        numOfRating: 10,
        ratingGivenBy: [null],
        numOfLike: 52,
        uniqueCode: "SHO001254",
        inStock: true,
        deliveryAtSingleTime: 10,
        timeOfDelivery: 7,
        numberOfCalling: 0,
        offer: offers,
        description: descriptions
    })

    product.save((err, result) => {
        if(err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })
} 

module.exports = saveProduct