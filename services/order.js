const orderItemModel = require("../models/orderItemModel");
const orderModel = require("../models/orderModel");

const newOrder = async (userid) => {
  const current = await orderModel.findOne({ userid, status: "pending" }); // why this?
  console.log(current);
  if (current !== null) {
    return false;
  }

  console.log("hello");
  const data = await orderModel.create({ userid });
  return data;
};

const getCurrentOrder = async (userid) => {
  const order = await orderModel.findOne({ userid, status: "pending" });

  // .populate("orderitems");
  if (!order) return false;

  const orderItems = await orderItemModel.find({ orderid: order._id });
  console.log("---------here2", orderItems);
  return {
    ...order.toObject(),
    items: [...orderItems.map((e) => e.toObject())],
  };
};

const addToOrder = async ({ item, userid }) => {
  const currentOrder = await getCurrentOrder(userid);
  console.log(currentOrder);
  // const { _id } = currentOrder;
  // await orderItemModel.create({
  //   orderid: _id,
  //   userid,
  //   itemid: item.id,
  //   price: item.price,
  //   itemname: item.name,
  // });
  // return true;
};

const cancelOrder = async (userid) => {
  const currentOrder = await getCurrentOrder(userid);
  if (!currentOrder) return false;

  const { _id } = currentOrder;
  return orderModel.findByIdAndUpdate(_id, { status: "cancelled" });
};

const allOrder = async (userid) => {
  return orderModel
    .find({ userid })
    .populate("orderitems")
    .map((e) => e.toObject());
};

const checkOutOrder = async (userid) => {
  const currentOrder = await getCurrentOrder(userid);
  if (!currentOrder || currentOrder?.items.length == 0) return false;

  const { _id } = currentOrder;
  return orderModel.findByIdAndUpdate(_id, { status: "completed" });
};

module.exports = {
  newOrder,
  getCurrentOrder,
  cancelOrder,
  allOrder,
  checkOutOrder,
  addToOrder,
};
