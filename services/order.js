const orderItemModel = require("../models/orderItemModel");
const orderModel = require("../models/orderModel");

const newOrder = async (userid) => {
  try {
    const current = await orderModel.findOne({ userid, status: "pending" }); // why this?

    // console.log("the current is", current);
    if (current !== null) throw new CustomError("There is a current order");

    const data = await orderModel.create({ userid });
    return data;
  } catch (err) {
    if (err.custom) throw new Error(err.message);
    throw new Error("Some error occured while creating a new order");
  }
};

const getCurrentOrder = async (userid) => {
  try {
    const order = await orderModel.findOne({ userid, status: "pending" });
    console.log("---------------here is the order", order);

    // .populate("orderitems");
    if (!order) throw new CustomError("No current order");

    const orderItems = await orderItemModel.find({ orderid: order._id });
    console.log("---------here is the order item", orderItems);
    // console.log(...order.toObject());
    return {
      ...order.toObject(),
      items: [...orderItems.map((e) => e.toObject())],
    };
  } catch (err) {
    if (err.custom) throw new CustomError(err.message);
    throw new Error("Some error occured while getting the current order");
  }
};

const addToOrder = async ({ item, userid }) => {
  try {
    const currentOrder = await getCurrentOrder(userid);
    console.log("---------- here is the current order", currentOrder);

    const { _id } = currentOrder;
    await orderItemModel.create({
      orderid: _id,
      userid,
      itemid: item.id,
      price: item.price,
      itemname: item.name,
    });
    await orderModel.updateOne(
      { userid, status: "pending" },
      { amount: currentOrder.amount + item.price }
    );
    return true;
  } catch (err) {
    if (err.custom) throw new Error(err.message);
    throw new Error("Some error occured while adding to the order");
  }
};

const cancelOrder = async (userid) => {
  try {
    const currentOrder = await getCurrentOrder(userid);
    const { _id } = currentOrder;
    return orderModel.findByIdAndUpdate(_id, { status: "cancelled" });
  } catch (err) {
    if (err.custom) throw new CustomError(err.message);
    throw new Error("Some error occured while cancelling orders");
  }
};

const allOrder = async (userid) => {
  try {
    const orders = await orderModel.find({ userid });
    console.log("-------------1", orders);
    if (!orders) return [];

    const _orders = orders.map((e) => e.toObject());
    console.log("-------------2", _orders);

    const final = [];

    for (const order of _orders) {
      const orderItems = await orderItemModel.find({ orderid: order._id });

      final.push({
        ...order,
        items: [...orderItems.map((e) => e.toObject())],
      });
    }
    // console.log(final);
    return final;
  } catch (err) {
    throw new Error("Some error occured while getting order history");
  }
};

const checkOutOrder = async (userid) => {
  try {
    const currentOrder = await getCurrentOrder(userid);
    if (currentOrder?.items.length == 0)
      throw new CustomError("There are no items in your order yet.");

    const { _id } = currentOrder;
    return orderModel.findByIdAndUpdate(_id, { status: "completed" });
  } catch (error) {
    if (err.custom) throw new CustomError(err.message);
    throw new Error("Some error occured while checking out order");
  }
};

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.custom = true;
  }
}

module.exports = {
  newOrder,
  getCurrentOrder,
  cancelOrder,
  allOrder,
  checkOutOrder,
  addToOrder,
};
