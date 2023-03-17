const {
  newOrder,
  getCurrentOrder,
  allOrder,
  addToOrder,
  checkOutOrder,
  cancelOrder,
} = require("../services/order");

const connectionMiddleWare = (socket) => {
  const userid = socket.sessionID;
  console.log("client connected", socket.sessionID);

  socket.emit("session", { id: socket.sessionID });
  socket.on("disconnect", () => {
    console.log("client disconnected", socket.sessionID);
  });

  const commands = {
    1: "Place order",
    99: "Checkout order",
    98: "See order history",
    97: "See current order",
    0: "Cancel order",
  };

  // ............
  // const service = new Service();
  const items = [
    { id: 2, name: "Pizza", price: 200 },
    { id: 3, name: "Rice", price: 500 },
    { id: 4, name: "Chicken", price: 100 },
    { id: 5, name: "Salad", price: 30 },
  ];

  socket.emit("user_options", commands);

  let pause = false;
  socket.on("user-response", async (msg) => {
    try {
      switch (Number.parseInt(msg)) {
        case 1:
          const order = await newOrder(userid);
          // console.log("---------the order is", order);
          pause = true;

          if (!order) {
            socket.send("There is an order present."); // i dont get this
          } else {
            socket.emit("order-list", items);
          }
          break;

        case 97:
          const current = await getCurrentOrder(userid);
          console.log("--------------", current);
          if (!current) {
            socket.send("There is no current order.");
          }
          socket.emit("current-order", current);
          break;

        case 98:
          const orderHistory = await allOrder(userid);
          if (!orderHistory || orderHistory.length == 0)
            socket.send("There is no history.");
          else socket.emit("order-history", orderHistory);
          break;

        case 99:
          await checkOutOrder(userid);
          pause = false;
          socket.send("Successfully checked out your order");

          break;

        case 0:
          await cancelOrder(userid);
          pause = false;
          socket.send("Successfully cancelled your order");
          socket.emit("user_options", commands);
          break;

        default: {
          const item = items.find((item) => item.id == msg);
          if (!pause) {
            socket.send("invalid command");
            return;
          }

          console.log(item);
          await addToOrder({ item, userid });
          socket.send(`Successfully added ${item.name} to your order.`);
          socket.emit("order-list", items);
          socket.emit("user_options", commands);
        }
      }
    } catch (err) {
      socket.send(err.message);
    }
  });
};

module.exports = { connectionMiddleWare };
