const session = require("express-session");
require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },
});

module.exports = sessionMiddleware;
