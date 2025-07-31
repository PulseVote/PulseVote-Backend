const jwt = require("jsonwebtoken");

export let generateToken = function (payload, secret, expiresIn) {
  let token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return token;
};

