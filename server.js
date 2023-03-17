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

PORT = process.env.PORT;

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
