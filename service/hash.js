const bcrypt = require("bcrypt");

let passwordHasher = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSalt(saltRounds);
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
};

modules.export = passwordHasher;
