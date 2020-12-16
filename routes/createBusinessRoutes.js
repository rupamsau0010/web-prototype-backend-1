// Require depandencies

const express = require("express")

const router = express.Router()

// Import Local depandencies

const createBusinessController = require("../controllers/createBusinessControllers");
const uploadSingleFile = require("../services/multerForSingleFile");

// Shift to business account by providing minimum details

router.post("/:id", uploadSingleFile, createBusinessController.shiftToBusiness_post);

// export the module

module.exports = router