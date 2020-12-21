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