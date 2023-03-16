const session = require("express-session");

const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },
});

module.exports = sessionMiddleware;
