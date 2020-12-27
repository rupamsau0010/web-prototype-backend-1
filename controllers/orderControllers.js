// Import depandencies
const { v4: uuidv4 } = require("uuid");

// Import local depandencies
const User = require("../models/Users");
const Product = require("../models/Products");
const BusinessUser = require("../models/BusinessUserDetails");
const Order = require("../models/Orders");
const razorpay = require("../services/razorpaysdk");

module.exports.preOrderAddress_post = async (req, res) => {
  // Import data from req.params

  // Import data from req.body
  const userId = req.body.userId;

  const phoneNo = req.body.phoneNo;
  const deliveryPincode = req.body.deliveryPincode;
  const deliveryLandmark = req.body.deliveryLandmark;

  // Update the user data(take phone number)
  User.findByIdAndUpdate(
    { _id: userId },
    {
      phoneNo: phoneNo,
      deliveryPincode: deliveryPincode,
      deliveryLandmark: deliveryLandmark,
    },
    { new: true },
    function (err1, data1) {
      if (data1 && !err1) {
        res.json({
          status: "success",
          payload: data1,
        });
      } else {
        res.json({
          status: "failure",
          data1: null,
        });
      }
    }
  );
};

// Razorpay api for payment for any particular product
// Unchecked API(must be checked after frontend is ready)

module.exports.razorpay_post = async (req, res) => {
  // Get data from req.params

  // Get data from req.body
  const userId = req.body.userId;
  const productId = req.body.productId;

  // Get the price of the product
  const product = await Product.findById({ _id: productId });
  const price = product.price;

  // Get the user data
  const user = await User.findById({ _id: userId });

  const payment_capture = 1;
  const amount = price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: uuidv4(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);

    // Get the delivery date
    var days = product.timeOfDelivery;
    var date = new Date();
    var res = date.getTime() + days * 24 * 60 * 60 * 1000;
    date = new Date(res);

    const order = new Order({
      userId: userId,
      productId: productId,
      productImg: product.image[0],
      productTitle: product.name,
      productById: product.postById,
      paymentStatus: "requested",
      deliverBy: date,
      shippingAddress: user.deliveryLandmark,
      shippingPincode: user.deliveryPincode,
      phoneNo: user.phoneNo,
      orderDetails: response,
    });

    order.save((err1, data1) => {
      if (data1 && !err1) {
        res.json({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Razorpay webhooks(called by razorpay)
// Unchecked API(must be checked after frontend is ready)

module.exports.razorpayWebhook_post = async (req, res) => {
  // do a validation
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    // Update the orders data and status
    Order.findOneAndUpdate(
      { id: req.body.payload.payment.entity.order_id },
      { paymentStatus: "paid", orderDetails: req.body },
      { new: true },
      function (err1, data1) {
        if (data1 && !err1) {
          User.findByIdAndUpdate(
            { _id: data1.userId },
            { $pull: { cart: data1.productId }, $push: { orders: data1._id } },
            { new: true },
            function (err2, data2) {
              if (data2 && !err2) {
                BusinessUser.findByIdAndUpdate(
                  { _id: data1.productById },
                  { $push: { orders: data1._id } },
                  { new: true },
                  function (err3, data3) {
                    if (data3 && !err3) {
                      console.log("success");
                    } else {
                      console.log("faliure");
                    }
                  }
                );
              } else {
                console.log("failure");
              }
            }
          );
        } else {
          console.log("failure");
        }
      }
    );
  } else {
    // pass it
  }
  res.json({ status: "ok" });
};
