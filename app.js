const helmet = require("helmet");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./schemas/user.js");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());
// create a custom validation handler for success, and fail, also have a critical
app.get("/", (req, res) => {
  res.send("PulseVote API running");
});

app.get("/hello", (req, res) => {
  let data = {
    message: "Hello world from pulse vote",
  };
  res.json(data);
});

app.post("/api/Register", (req, res) => {
  const reqUser = req.body;
  let message;
  const isValid = User.validate(reqUser).catch((error) =>
    res.json({ message: error }).send()
  );

  if (!isValid) {
    message = {
      message: "You have made an invalid request by sending empty data!",
    };
    res.status(400).json(message);
  }
});

module.exports = app;
