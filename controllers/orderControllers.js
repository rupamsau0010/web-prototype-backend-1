// Import depandencies

// Import local depandencies
const User = require("../models/Users");
const razorpay = require("../services/razorpaysdk")

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

