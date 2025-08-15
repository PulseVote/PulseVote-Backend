const User = require("../schemas/user.js");
const bcrypt = require("bcrypt");
const tokenization = require("../service/tokenGeneration.js");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Token = require("../schemas/token.js");
const { sha256 } = require("js-sha256");
async function registerUser(req, res) {
  if (!req || !req.body) {
    return res.status(400).json({ message: "Invalid  register request" });
  }
  const { username, email, password, signUpDate } = req.body;
  if (!username || !email || !password || !signUpDate) {
    return res.status(400).json({ message: "You sent missing data" });
  }
  const emailExists = await User.findOne({ email: email }).exec();
  if (emailExists) {
    return res
      .status(409)
      .json({ message: "This email is already in use, please try again" });
  }

  const validUser = new User({
    username: username,
    password: password,
    email: email,
    signUpDate: signUpDate,
  });
  try {
    await validUser.save();

    res.status(201).json({
      message: `Successfully registered ${validUser.username}!`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
// creating the long lived token - refresh token
async function loginUser(req, res) {
  const { email, password } = req.body;
  const isValidDetails = email.length > 3 && password.length > 6 ? true : false;
  if (!isValidDetails) {
    return res.status(400).json({
      errorMessage: "You have sent invalid email or password details.",
    });
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ errorMessage: "User does not exist!" });
  }
  const validPasswordAttempt = await bcrypt.compare(password, user.password);
  if (!validPasswordAttempt) {
    return res.status(401).json({
      errorMessage: "Username or password is incorrect!",
    });
  }
  let refreshToken = tokenization(
    { id: user._id },
    process.env.SECRET,
    3600 * 24 * 7 * 1000
  );

  let accessToken = tokenization({ id: user._id }, process.env.SECRET, 30 * 60);

  const deviceId = uuidv4();
  req.session.deviceId = deviceId;
  req.session.refresh = refreshToken;
  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 3600 * 24 * 7 * 1000);

  const newMetaToken = new Token({
    user: user._id,
    deviceId: deviceId,
    token: refreshToken,
    isLocked: false,
    isSuspicious: false,
    expiresAt: oneWeekLater,
  });
  await user.save();
  await newMetaToken.save();
  res.setHeader("Authorization", "Bearer " + accessToken);
  res.status(200).json();
}
async function logoutUser(req, res) {
  const { id } = req.user;
  const foundRefreshToken = Token.findOne({ user: id });
  if (!foundRefreshToken) {
    return res.status(401).json({ message: "You are not authorized" });
    // send some email to that user
  }
  // chop down this look up logic and abstract it
  foundRefreshToken.token = null;
  foundRefreshToken.save();
  return res.status(200).json({ message: "You have been logged out" });
}
async function refreshToken(req, res) {
  const { refresh } = req.session;
  const hashedRefreshToken = sha256(refresh);
  const matchingTokens = Token.findOne({ token: hashedRefreshToken });
  if (!matchingTokens) {
    return res.status(401).json({ message: "You are not authorized" });
    // this means that the user will have to re login
  }
  const decoded = jwt.verify(refresh, process.env.SECRET);
  const { id } = decoded;
  const foundUser = User.findOne({ _id: id });
  if (!foundUser) {
    return res.status(401).json({ message: "You are not authorized" });
    // send some email to that user
  }
  let newAccessToken = tokenization({ id: id }, process.env.SECRET, 30 * 60);
  res.setHeader("Authorization", `Bearer ${newAccessToken}`);
  return res.status(200);
}
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
