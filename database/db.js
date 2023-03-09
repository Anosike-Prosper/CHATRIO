const mongoose = require("mongoose");

const MONGO_URL = "mongodb://localhost:27017/note_app";

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
