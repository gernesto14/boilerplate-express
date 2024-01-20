require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Serve static files from the "public" directory
app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Route-specific logger middleware for the "/json" route
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// Define a route for the root ("/") path
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Define a route for "/json"
app.get("/json", (req, res) => {
  let text = "Hello json";
  let newText =
    process.env.MESSAGE_STYLE === "uppercase" ? text.toUpperCase() : text;
  res.json({
    message: newText,
  });
});

app.get(
  "/now",
  (req, res, next) => {
    // middleware function

    req.time = new Date().toString();
    console.log(req.time);
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);

app.get("/:word/echo", (req, res) => {
  const word = req.params.word;
  res.json({ echo: word });
});

app
  .route("/name")
  .get((req, res) => {
    // GET request
    const firstName = req.query.first;
    const lastName = req.query.last;

    res.json({ name: firstName + " " + lastName });
  })
  .post((req, res) => {
    // POST request

    const firstName = req.body.first;
    const lastName = req.body.last;
    res.json({ name: firstName + " " + lastName });
  });

module.exports = app;
