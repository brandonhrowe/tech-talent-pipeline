const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const path = require("path");
const db = require("./db");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({ db });
const passport = require("./passport");

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Pipeline of Talented Tech",
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  })
);

// Utilize passport for authentication
app.use(passport.initialize())
app.use(passport.session())

// Serve static files from /public directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Send HTML file
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  let status = err.status || 500;
  let message =
    err.message || "Sorry, there's been a slight problem on our server";
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
