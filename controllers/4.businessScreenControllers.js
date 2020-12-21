// Import dependancies 
const { v4: uuidv4 } = require("uuid");

// Import Local dependancies
const User = require("../models/Users")
const BusinessUser = require("../models/BusinessUserDetails")
const s3 = require("../services/aws-S3")

// Update the details of the business accout(only business image)
module.exports.updateBusinessImage_post = async(req, res) => {
    // Get details from req.params

    // Get details from req.body
    const userId = req.body.userId
    const item = req.file

    console.log(userId);

    // Find the user in the database
    const user = await User.findById({_id: userId })
    
    // Get the existing image url
    existingImageUrl = user.image

    const imgName = existingImageUrl.split("/")[4]

    s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `businessUserImages/${imgName}`
    },function (err,data){
        if(!err) {
                
            let myFile1 = item.originalname.split(".");
            const fileType1 = myFile1[myFile1.length - 1];

            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                ContentType: "image/jpg",
                Key: `businessUserImages/${uuidv4()}.${fileType1}`,
                Body: item.buffer,
            }

            s3.upload(params, function (err1, data1) {
                if (err1) {
                    res.json({
                        status: "failure",
                        payload: "Opps...Something happened wrong"
                    })
                } else {

                    User.findByIdAndUpdate({_id: userId}, {image: data1.Location}, {new: true}, async function(err2, data2){
                        if(data2) {
                            BusinessUser.findOneAndUpdate({mainUserId: userId}, {businessImg: data1.Location}, {new: true}, async function(err3, data3){
                                if(data3) {
                                    res.json({
                                        status: "success",
                                        payload: data2.image
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
            })
        }
        else {
            res.json({
                status: "failure",
                payload: "Opps...Something happened wrong"
            })
        }
    })
}

// Upade business details(all except business image)

module.exports.updateBusinessDetails_post = async(req, res) => {
    // Get details from req.params

    // Get details from req.body
    const userId = req.body.userId

    // Get the details from the form
    let businessName = req.body.businessName;
    let businessOwnerName = req.body.businessOwnerName;
    let businessOwnerPhoneNo = req.body.businessOwnerPhoneNo;
    let ownerAddressPincode = req.body.ownerAddressPincode;
    let ownerAddressState = req.body.ownerAddressState;
    let businessType = req.body.businessType;
    let shippingPincodes = req.body.shippingPincodes;
    let paymentUPIId = req.body.paymentUPIId;

    // Update the businessUser details
    BusinessUser.findOneAndUpdate({mainUserId: userId}, {businessName: businessName, businessOwnerName: businessOwnerName, businessOwnerPhoneNo: businessOwnerPhoneNo, ownerAddressPincode: ownerAddressPincode, ownerAddressState: ownerAddressState, businessType: businessType, shippingPincodes: shippingPincodes, paymentUPIId: paymentUPIId}, {new: true}, async function(err1, data1){
        console.log(data1);
        if(data1) {
            console.log(data1);
            res.json({
                status: "success",
                payload: data1
            })
        } else {
            res.json({
                status: "failure",
                payload: null
            })
        }
    })
}