const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  signUpDate: {
    type: Date,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);
userSchema.pre("save", function (next) {
  if (!this.isModified("passwordHash")) return next();
  const saltRounds = 10;
  const salt = bcrypt.genSalt(saltRounds);
  const passwordHash = bcrypt.hash(this.passwordHash, salt);
  next();
});
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};
module.exports = User;
