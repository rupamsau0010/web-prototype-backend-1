// Import depandencies
const { v4: uuidv4 } = require("uuid");

// Import local depandencies
const User = require("../models/Users");
const Product = require("../models/Products");
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

module.exports.razorpay_post = async (req, res) => {
  // Get data from req.params

  // Get data from req.body
  const userId = req.body.userId;

  // Find the user and get the cart details
  const user = await User.findById({ _id: userId });

  // Total value to be paid
  var i = 0,
  var total = 0;
  for (i = 0; i < user.cart.length; i++) {
    // Find product and get the price
    const product = await Product.findById({ _id: user.cart[i] });
    total += product.price;

    if (i == user.cart.length - 1) {
      const payment_capture = 1;
      const amount = total;
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

        res.json({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};