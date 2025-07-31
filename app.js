const helmet = require("helmet");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRouter.js");
const User = require("./schemas/user.js");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "https://localhost:5137",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use(express.json());
// create a custom validation handler for success, and fail, also have a critical
app.get("/", (req, res) => {
  res.send("PulseVote API running");
});

module.exports = app;
