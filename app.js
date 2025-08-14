const helmet = require("helmet");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
var cookieSession = require("cookie-session");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRouter.js");
const User = require("./schemas/user.js");
const mongoose = require("mongoose");
const protection = require("./middleware/protected.js");
dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cookieSession({
    maxAge: 3600 * 24 * 7 * 1000,
    secure: true,
    httpOnly: true,
    keys: ["key"],
  })
);
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);

// create a custom validation handler for success, and fail, also have a critical
app.get("/", (req, res) => {
  res.send("PulseVote API running");
});
app.get("/api/protected", protection, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}! You have accessed protected data.`,
    timestamp: new Date(),
  });
});

module.exports = app;
