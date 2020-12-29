// Import dependancies
const { v4: uuidv4 } = require("uuid");

// Import Local dependancies
const User = require("../models/Users");
const BusinessUser = require("../models/BusinessUserDetails");
const s3 = require("../services/aws-S3");
const Product = require("../models/Products");
const ProductCount = require("../models/productCounts");
const Order = require("../models/Orders");
const { findOne } = require("../models/Users");

// Update the details of the business accout(only business image)
module.exports.updateBusinessImage_post = async (req, res) => {
  // Get details from req.params

  // Get details from req.body
  const userId = req.body.userId;
  const item = req.file;

  console.log(userId);

  // Find the user in the database
  const user = await User.findById({ _id: userId });

  // Get the existing image url
  existingImageUrl = user.image;

  const imgName = existingImageUrl.split("/")[4];

  s3.deleteObject(
    {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `businessUserImages/${imgName}`,
    },
    function (err, data) {
      if (!err) {
        let myFile1 = item.originalname.split(".");
        const fileType1 = myFile1[myFile1.length - 1];

        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          ContentType: "image/jpg",
          Key: `businessUserImages/${uuidv4()}.${fileType1}`,
          Body: item.buffer,
        };

        s3.upload(params, function (err1, data1) {
          if (err1) {
            res.json({
              status: "failure",
              payload: "Opps...Something happened wrong",
            });
          } else {
            User.findByIdAndUpdate(
              { _id: userId },
              { image: data1.Location },
              { new: true },
              async function (err2, data2) {
                if (data2) {
                  BusinessUser.findOneAndUpdate(
                    { mainUserId: userId },
                    { businessImg: data1.Location },
                    { new: true },
                    async function (err3, data3) {
                      if (data3) {
                        res.json({
                          status: "success",
                          payload: data2.image,
                        });
                      } else {
                        res.json({
                          status: "failure",
                          payload: "Opps...Something happened wrong",
                        });
                      }
                    }
                  );
                } else {
                  res.json({
                    status: "failure",
                    payload: "Opps...Something happened wrong",
                  });
                }
              }
            );
          }
        });
      } else {
        res.json({
          status: "failure",
          payload: "Opps...Something happened wrong",
        });
      }
    }
  );
};

// Upade business details(all except business image)

module.exports.updateBusinessDetails_post = async (req, res) => {
  // Get details from req.params

  // Get details from req.body
  const userId = req.body.userId;

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
  BusinessUser.findOneAndUpdate(
    { mainUserId: userId },
    {
      businessName: businessName,
      businessOwnerName: businessOwnerName,
      businessOwnerPhoneNo: businessOwnerPhoneNo,
      ownerAddressPincode: ownerAddressPincode,
      ownerAddressState: ownerAddressState,
      businessType: businessType,
      shippingPincodes: shippingPincodes,
      paymentUPIId: paymentUPIId,
    },
    { new: true },
    async function (err1, data1) {
      console.log(data1);
      if (data1) {
        console.log(data1);
        res.json({
          status: "success",
          payload: data1,
        });
      } else {
        res.json({
          status: "failure",
          payload: null,
        });
      }
    }
  );
};

// Create a business post

module.exports.createBusinessPost_post = async (req, res) => {
  // Get data from req.params

  // Get the data from req.body
  const userId = req.body.userId;

  const name = req.body.name;
  const brandNameOrShopName = req.body.brandNameOrShopName;
  const catagory = req.body.catagory;
  const tagline = req.body.tagline;
  const file = req.files;
  const price = req.body.price;
  const size = req.body.size;
  const color = req.body.color;
  const uniqueCode = "";
  const inStock = true;
  const deliveryAtSingleTime = req.body.deliveryAtSingleTime;
  const timeOfDelivery = req.body.timeOfDelivery;
  const description = req.body.description;

  var newDescription = [];
  for (i = 0; i < description.length; i++) {
    newDescription.push(JSON.parse(description[i]));
  }

  // Function for product Unique code generation
  function generateUniqueCode(type) {
    const id = "5fe183681f6e5b811e1a6220";

    const typeForm = type.substr(0, 3);

    const typeFormUpper = typeForm.toUpperCase();
    ProductCount.findByIdAndUpdate(
      { _id: id },
      { $inc: { [typeForm]: 1 } },
      function (err1, data1) {
        if (data1) {
          const returnData = typeFormUpper + String(data1[typeForm]);
          return returnData;
        } else {
          return 0;
        }
      }
    );
  }

  // First Check the user is a business user or not
  const businessUser = await User.findById({ _id: userId });

  if (businessUser.profileType === "business") {
    // Upload the images of the product to aws s3
    s3.createBucket(function () {
      // Where you want to store your links after successfully uploading to AWS s3 bucket
      var ResponseData = [];

      file.map((item) => {
        let myFile1 = item.originalname.split(".");
        const fileType1 = myFile1[myFile1.length - 1];

        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          ContentType: "image/jpg",
          Key: `businessPosts/${uuidv4()}.${fileType1}`,
          Body: item.buffer,
        };

        s3.upload(params, function (err, data) {
          if (err) {
            res.json({ error: true, Message: err });
          } else {
            ResponseData.push(data.Location);

            if (ResponseData.length == file.length) {
              const id = "5fe183681f6e5b811e1a6220";

              const typeForm = catagory.substr(0, 3);

              const typeFormUpper = typeForm.toUpperCase();
              ProductCount.findByIdAndUpdate(
                { _id: id },
                { $inc: { [typeForm]: 1 } },
                function (err1, data1) {
                  if (data1) {
                    const returnData = typeFormUpper + String(data1[typeForm]);

                    const product = new Product({
                      name: name,
                      postById: userId,
                      brandNameOrShopName: brandNameOrShopName,
                      catagory: catagory,
                      tagline: tagline,
                      postById: userId,
                      image: ResponseData,
                      price: price,
                      size: size,
                      color: color,
                      uniqueCode: returnData,
                      inStock: inStock,
                      deliveryAtSingleTime: deliveryAtSingleTime,
                      timeOfDelivery: timeOfDelivery,
                      description: newDescription,
                    });

                    product.save((err1, data1) => {
                      if (data1) {
                        User.findByIdAndUpdate(
                          { _id: userId },
                          { $push: { businessPosts: data1._id } },
                          function (err2, data2) {
                            if (data2) {
                              res.json({
                                status: "success",
                                payload: null,
                              });
                            } else {
                              res.json({
                                status: "failure",
                                payload: "Opps...Something went wrong",
                              });
                            }
                          }
                        );
                      } else {
                        res.json({
                          status: "failure",
                          payload: null,
                        });
                      }
                    });
                  } else {
                    res.json({
                      status: "failure",
                      payload: "Opps...Something went wrong",
                    });
                  }
                }
              );
            } else {
            }
          }
        });
      });
    });
  } else {
    res.json({
      status: "failure",
      payload: "You are not authorized to make a business post",
    });
  }
};

// Make a product as out of stock

module.exports.productStatusUpdate_post = async (req, res) => {
  // Get data from req.params

  // Get data from req.body
  const userId = req.body.userId;
  const productId = req.body.productId;

  Product.findOneAndUpdate(
    { _id: productId, postById: userId },
    { inStock: false },
    { new: true },
    function (err1, data1) {
      if (data1) {
        res.json({
          status: "success",
          payload: data1,
        });
      } else {
        res.json({
          status: "failure",
          payload: null,
        });
      }
    }
  );
};

// Upadete the product details(without images as images can't be updated)

module.exports.updateProductDetails_post = async (req, res) => {
  // Get data from req.params

  // Get details from req.body
  const userId = req.body.userId;
  const productId = req.body.productId;

  const name = req.body.name;
  const brandNameOrShopName = req.body.brandNameOrShopName;
  const catagory = req.body.catagory;
  const tagline = req.body.tagline;
  const price = req.body.price;
  const size = req.body.size;
  const color = req.body.color;
  const deliveryAtSingleTime = req.body.deliveryAtSingleTime;
  const timeOfDelivery = req.body.timeOfDelivery;
  const description = req.body.description;

  // Update the document
  Product.findOneAndUpdate(
    { _id: productId, postById: userId },
    {
      name: name,
      brandNameOrShopName: brandNameOrShopName,
      catagory: catagory,
      tagline: tagline,
      price: price,
      size: size,
      color: color,
      deliveryAtSingleTime: deliveryAtSingleTime,
      timeOfDelivery: timeOfDelivery,
      description: description,
    },
    { new: true },
    function (err1, data1) {
      console.log(data1);
      if (data1) {
        res.json({
          status: "success",
          payload: data1,
        });
      } else {
        console.log(err1);
        res.json({
          status: "failure",
          payload: null,
        });
      }
    }
  );
};

// Delete a business post (product)

module.exports.deleteProducts_post = async (req, res) => {
  // Get details from req.params

  // Get details from req.body
  const userId = req.body.userId;
  const productId = req.body.productId;

  // Find the product
  const product = await Product.findOne({ _id: productId, postById: userId });

  const imageArray = product.image;
  var count = 0;
  imageArray.map((item) => {
    const imgName = item.split("/")[4];

    s3.deleteObject(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `businessPosts/${imgName}`,
      },
      function (err1, data1) {
        if (data1) {
          count += 1;

          if (count == imageArray.length) {
            Product.findOneAndDelete(
              { _id: productId, postById: userId },
              function (err2, data2) {
                if (data2) {
                  User.findByIdAndUpdate(
                    { _id: userId },
                    { $pull: { businessPosts: productId } },
                    { new: true },
                    function (err3, data3) {
                      if (data3) {
                        res.json({
                          status: "success",
                          payload: data3,
                        });
                      } else {
                        res.json({
                          status: "failure",
                          payload: null,
                        });
                      }
                    }
                  );
                } else {
                  res.json({
                    status: "failure",
                    payload: null,
                  });
                }
              }
            );
          }
        }
      }
    );
  });
};

// Find all the products posted by any business user

module.exports.findAllProducts_get = async (req, res) => {
  // Get data from req.params

  // Get data from req.body
  const userId = req.body.userId;

  // Get all the products posted by the business User
  const user = await User.findById({ _id: userId });

  var i = 0, count = 0
    allProducts = [];
  for (i = 0; i < user.businessPosts.length; i++) {
    Product.findById({_id: user.businessPosts[i]}, function(err1, data1){
      count += 1
      if(data1 && !err1) {
        allProducts.push(data1)
      } 
      if(count == user.businessPosts.length && allProducts.length > 0) {
        res.json({
          status: "success",
          payload: allProducts
        })
      } else if(count == user.businessPosts.length && allProducts.length <= 0) {
        res.json({
          status: "success",
          payload: "You don;t have any producrts posted yet"
        })
      }
    })
  }
};

// See all my orders(all orders of a business user)

module.exports.seeOrders_get = async (req, res) => {
  // get data from req.params

  // get data from req.body
  const userId = req.body.userId;

  // Get the businessUserDetails and send to the frontend
  const businessUser = await BusinessUser.findOne({ mainUserId: userId });

  var i = 0,
    myOrders = [],
    count = 0;
  for (i = 0; i < businessUser.orders.length; i++) {
    Order.findById({ _id: businessUser.orders[i] }, function (err1, data1) {
      count += 1;
      if (data1 && !err1) {
        myOrders.push(data1);
      }
      if (count == businessUser.orders.length && myOrders.length > 0) {
        res.json({
          status: "success",
          payload: myOrders,
        });
      } else if (count == businessUser.orders.length && myOrders.length <= 0) {
        res.json({
          status: "success",
          payload: "You did't get any orders still now.",
        });
      }
    });
  }
};

// Mark an order as dekivered

module.exports.markAsdelivered_post = async (req, res) => {
  // Get data fro req.params
  const orderId = req.params.orderId;

  // Get data from req.body
  const userId = req.body.userId;

  // Find the order and change the status
  Order.findOneAndUpdate(
    { _id: orderId, productById: userId },
    { delivered: true },
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
          payload: "Opps...Something happened wrong. Please try again later",
        });
      }
    }
  );
};
