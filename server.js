 const mongoose = require("mongoose");
const app = require("./app");
const tls = require("node:tls");
const https = require("node:https");
const fs = require("fs");
const { log } = require("node:console");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const options = {
  key: fs.readFileSync("shravans-key.pem"),
  cert: fs.readFileSync("shravans-cert.pem"),
};
async function main() {
  await mongoose.connect(process.env.MONGODB);
}
main().catch((error) => log(error));
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on https${PORT}`);
});

//Admin123.
