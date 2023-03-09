const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();

PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const { connectToMongoDB } = require("./database/db");

const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  socket.emit("connected", "connected to backend");

  socket.on("disconnect", () => {
    console.log("client disconnected", socket.id);
  });
});

connectToMongoDB();

server.listen(process.env.PORT, () => {
  console.log("listening on *:3000");
});
