// Importing the depandencies...
// Making a simple user Schema in mongoDB...

const mongoose = require("mongoose")

const businessUserDetailsSchema = new mongoose.Schema({
    mainUserId: {
        type: String,
        required: true
    },
    mainUserRegistrationId: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    businessImg: {
        type: String,
        required: true
    },
    businessOwnerName: {
        type: String,
        required: true,
    },
    businessOwnerPhoneNo: {
        type: String,
        required: true
    },
    businessOwnerPanNo: {
        type: String,
        required: true
    },
    businessOwnerPanCard: {
        type: String,
        required: true
    },
    businessVarified: {
        type: Boolean,
        default: false
    },
    ownerAddressPincode: {
        type: String,
        required: true,
    },
    ownerAddressState: {
        type: String,
        required: true,
    },
    businessType: {
        type: String,
        required: true
    },
    shippingPincodes: [String],
    paymentUPIId: {
        type: String,
        required: true
    },    
    orders: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("businessuserdetail", businessUserDetailsSchema)