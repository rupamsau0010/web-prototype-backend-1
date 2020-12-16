// Import Depandencies
const { v4: uuidv4 } = require("uuid");

// Import Local Depandencies

const User = require("../models/Users");
const BusinessUserDetail = require("../models/BusinessUserDetails");
const s3 = require("../services/aws-S3");

// Shifting to business account.
// General user already exists, shifting to business user.

module.exports.shiftToBusiness_post = async (req, res) => {
  //------------------------------------------------Upload image to s3 and get URL---------------------------------------------------//

  // Upload pancard img to the s3 bucket and get link
  // Get array of the two img
  var file = [req.files.panCardImg[0], req.files.businessImg[0]];

  s3.createBucket(function () {
    //Where you want to store your links after successfully uploading to AWS s3 bucket
    var ResponseData = [];

    file.map((item) => {
      let myFile1 = item.originalname.split(".");
      const fileType1 = myFile1[myFile1.length - 1];

      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: "image/jpg",
        Key: `businessUserImages/${uuidv4()}.${fileType1}`,
        Body: item.buffer,
      };
      s3.upload(params, function (err, data) {
        if (err) {
          res.json({ error: true, Message: err });
        } else {
          ResponseData.push(data);
          if (ResponseData.length == file.length) {
            // console.log(ResponseData);

            let mainUserId = req.params.id;

            // Get values from req.body
            // Get the details from the form
            let mainUserRegistrationId = req.body.mainUserRegistrationId;
            let businessName = req.body.businessName;
            let businessImg = ResponseData[0].Location;
            let businessOwnerName = req.body.businessOwnerName;
            let businessOwnerPhoneNo = req.body.businessOwnerPhoneNo;
            let businessOwnerPanNo = req.body.businessOwnerPanNo;
            let businessOwnerPanCard = ResponseData[1].Location;
            let ownerAddressPincode = req.body.ownerAddressPincode;
            let ownerAddressState = req.body.ownerAddressState;
            let businessType = req.body.businessType;
            let shippingPincodes = req.body.shippingPincodes;
            let paymentUPIId = req.body.paymentUPIId;

            const newBusinessUser = {
              mainUserId: mainUserId,
              mainUserRegistrationId: mainUserRegistrationId,
              businessName: businessName,
              businessImg: businessImg,
              businessOwnerName: businessOwnerName,
              businessOwnerPhoneNo: businessOwnerPhoneNo,
              businessOwnerPanNo: businessOwnerPanNo,
              businessOwnerPanCard: businessOwnerPanCard,
              ownerAddressPincode: ownerAddressPincode,
              ownerAddressState: ownerAddressState,
              businessType: businessType,
              shippingPincodes: shippingPincodes,
              paymentUPIId: paymentUPIId,
            };

            const businessUser = BusinessUserDetail.create(newBusinessUser);

            if (businessUser) {
              User.findOneAndUpdate(
                { _id: mainUserId },
                { image: businessImg, profileType: "business" },
                function (err1, data1) {
                  if (!err1) {
                    res.json({
                      status: "success",
                      payload: null,
                    });
                  } else {
                    res.json({
                      status: "failure",
                      payload:
                        "Opps...Something happened wrong. Please try again.",
                    });
                  }
                }
              );
            }
          }
        }
      });
    });
  });
};
