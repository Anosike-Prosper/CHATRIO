const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");

const { v4: uuidv4 } = require("uuid");

const { connectToMongoDB } = require("./database/db");
const orderModel = require("./models/orderModel");
const { connectionMiddleWare } = require("./middlewares/connect");
const sessionMiddleware = require("./middlewares/sessionMiddleware");

PORT = 3000;

class InMemorySessionStore {
  constructor() {
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.keys()];
  }
}

const server = http.createServer(app);

// const { connectToMongoDB } = require("./database/db");
const io = new Server(server);

app.use(cors());
app.use(express.static("public")); /* Static Files */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public" + "/chatbot.html");
});

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

app.use(sessionMiddleware);
io.use(wrap(sessionMiddleware));

const sessionStore = new InMemorySessionStore();
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;

  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);

    if (session) {
      console.log("Old User Detected");
      socket.sessionID = sessionID;
      return next();
    } else {
      console.log("New User Detected");
    }
  }

  // create new session
  socket.sessionID = uuidv4();
  sessionStore.saveSession(socket.sessionID, true);
  next();
});

io.on("connection", connectionMiddleWare);

connectToMongoDB();

server.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});

// {
//   const userid = socket.sessionID;
//   console.log("client connected", socket.sessionID);

//   socket.emit("session", { id: socket.sessionID });
//   socket.on("disconnect", () => {
//     console.log("client disconnected", socket.sessionID);
//   });

//   const commands = {
//     1: "Place order",
//     99: "Checkout order",
//     98: "See order history",
//     97: "See current order",
//     0: "Cancel order",
//   };

//   // ............
//   // const service = new Service();
//   const items = [
//     { id: 2, name: "cassava", price: 200 },
//     { id: 3, name: "Garri", price: 500 },
//     { id: 4, name: "Ewa", price: 100 },
//     { id: 5, name: "Titus", price: 30 },
//   ];

//   socket.emit("user_options", commands);

//   let pause = false;
//   socket.on("user-response", async (msg) => {
//     console.log(msg);
//     try {
//       switch (Number.parseInt(msg)) {
//         case 1:
//           const order = await newOrder(userid);
//           // console.log("---------the order is", order);
//           pause = true;

//           if (!order) {
//             socket.send("There is an order present."); // i dont get this
//           } else {
//             socket.emit("order-list", items);
//           }
//           break;

//         case 97:
//           const current = await getCurrentOrder(userid);
//           console.log("--------------", current);
//           if (!current) {
//             socket.send("There is no current order.");
//           }
//           socket.emit("current-order", current);
//           break;

//         case 98:
//           const orderHistory = await allOrder(userid);
//           if (!orderHistory || orderHistory.length == 0)
//             socket.send("There is no history.");
//           else socket.emit("order-history", orderHistory);
//           break;

//         case 99:
//           await checkOutOrder(userid);
//           pause = false;
//           socket.send("Successfully checked out your order");
//           break;

//         case 0:
//           await cancelOrder(userid);
//           pause = false;
//           socket.send("Successfully cancelled your order");
//           break;

//         default: {
//           const item = items.find((item) => item.id == msg);
//           if (!pause) {
//             socket.send("invalid command");
//             return;
//           }

//           console.log(item);
//           await addToOrder({ item, userid });
//           socket.send(`Successfully added ${item.name} to your order.`);
//           socket.emit("order-list", items);
//           socket.emit("user_options", commands);
//         }
//       }
//     } catch (err) {
//       socket.send(err.message);
//     }
//   });
// }
