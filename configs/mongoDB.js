// Getting the Depandencies
const mongoose = require("mongoose");

// Getting the MongoDB atlas URI from the .env

URI = process.env.MONGO_URI;

// Connecting with mongoDB atlas cloud database
// Creating a mongoConnect Function

const mongoConnect = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((result) => {
      console.log("Successfullly coneected with MongoDB atlas");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
