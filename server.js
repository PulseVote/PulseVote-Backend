const mongoose = require("mongoose");
const app = require("./app");

const tls = require("node:tls");
const https = require("node:https");
const fs = require("fs");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const options = {
  key: fs.readFileSync("shravans-key.pem"),
  cert: fs.readFileSync("shravans-cert.pem"),
};
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on https${PORT}`);
});
