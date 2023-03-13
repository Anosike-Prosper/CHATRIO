const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

function connectToMongoDB() {
  mongoose.set("strictQuery", false);
  mongoose.connect(MONGO_URL);

  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDb successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occured", err);
  });
}

module.exports = { connectToMongoDB };
