// this is my favourite one

const { sha256 } = require("js-sha256");
const Token = require("../schemas/token");
let refreshMiddle = async (req, res, next) => {
  const { deviceId, refresh } = req.session;

  if (!deviceId || !refresh) {
    return res.status(401).json({ message: "Unautorized accesss" });
  }
  const hashedRefreshToken = sha256(refresh);
  const tokenFound = await Token.findOne({ token: hashedRefreshToken });
  const tokenFoundWithDevice = await Token.findOne({
    token: hashedRefreshToken,
    deviceId: deviceId,
  });
  if (!tokenFoundWithDevice && tokenFound) {
    // we found the token but not to this device
    return res.status(403).json({ message: "Forbidden!" });
  }
  next();
};
module.exports = refreshMiddle;
