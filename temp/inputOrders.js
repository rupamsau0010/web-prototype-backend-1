// Import dependencies
const mongoose = require("mongoose")
const express = require("express")

const app = express()

// Import local depandencies
const Order = require("../models/Orders")

// Order details
const orderDetails = {
    bsf: "something",
    order_card: "another something"
}

const saveOrder = () => {
    const order = new Order({
        userId: "5fc498de6ca2124ab4ab38de",
        productId: "5fe8399fbcc8a021c8958f4b",
        productImg: "https://salt-ecosystem-web-1.s3.amazonaws.com/businessPosts/1f7473b3-2d13-4ecc-81ba-ef20ad5543c5.jpg",
        productTitle: "xyz",
        productById: "5fbce458ab4372504810b467",
        paymentStatus: "paid",
        deliverBy: Date.now(),
        shippingAddress: "purba jagg put",
        shippingPincode: "458796",
        phoneNo: "879546587",
        orderDetails: orderDetails
    })

    order.save((err1, data1) => {
        if(data1 && !err1) {
            console.log(data1);
        } else {
            console.log(err1);
        }
    })
}

module.exports = saveOrder