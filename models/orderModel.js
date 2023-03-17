const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userid: {
      type: String,
      required: [true, "Provide user ID!"],
    },

    status: {
      type: String,
      enum: ["completed", "pending", "cancelled"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Please provide a price"],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
