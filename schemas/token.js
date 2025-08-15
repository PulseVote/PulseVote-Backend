const mongoose = require("mongoose");

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
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.token = await bcrypt.hash(this.token, salt);
  next();
});
tokenSchema.methods.compareToken = function (candidateToken) {
  return bcrypt.compare(candidateToken, this.token);
};
const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
