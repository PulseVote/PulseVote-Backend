const mongoose = require("mongoose");
const { sha256 } = require("js-sha256");
const tokenSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    require: false,
  },
  isLocked: {
    require: true,
    type: Boolean,
  },
  isSuspicious: {
    require: true,
    type: Boolean,
  },
  expiresAt: {
    type: Date,
    require: true,
  },
  deviceId: {
    type: String,
    require: true,
  },
});
tokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) return next();
  this.token = sha256(this.token);
  next();
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
