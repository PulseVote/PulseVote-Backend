const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PulseVote API running");
});

app.get("/hello", (req, res) => {
  res.send("Hello world from pulse vote");
});

module.exports = app;
