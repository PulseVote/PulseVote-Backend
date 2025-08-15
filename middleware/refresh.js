// this is my favourite one

const Token = require("../schemas/token");
let refresh = async (req, res, next) => {
  const { deviceId, token } = req.session;

  if (!deviceId || !token) {
    return res.status(401).json({ message: "Unautorized accesss" });
  }

  const tokenFound = await Token.findOne({ token: token });
  const tokenFoundWithDevice = Token.findOne({
    token: token,
    deviceId: deviceId,
  });
  if (!tokenFoundWithDevice && tokenFound) {
    // we found the token but not to this device
    return res.status(403).json({ message: "Forbidden!" });
  }
  next();
};
