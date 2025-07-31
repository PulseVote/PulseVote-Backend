const jwt = require("jsonwebtoken");

let generateToken = function (payload, secret, expiresIn) {
  let token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return token;
};
module.exports = generateToken;
