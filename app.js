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
  
 
  // remmeber to user bcrypt to hash this
  const newUser = new User({
    username: reqUser.username,
    passwordHash: reqUser.passwordHash,
    signUpDate: reqUser.signUpDate,
    email: reqUser.email,
  });
   newUser.save().catch((err) =>
    res
      .status(500)
      .json({
        message: "internal server error",
        errorMessage: err,
      })
      .send()
  );
  res
    .status(200)
    .json({ username: `${newUser.username} has been created successfully` })
    .send();
});

module.exports = app;
