const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema(
  {
    userid: {
      type: String,
      required: [true, "Provide user ID!"],
    },
    orderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    
    itemid: {
      type: String,
      required: [true, "Please provide the ID of the item!"],
    },
    itemname: {
      type: String,
      required: [true, "Please provide item name!"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
