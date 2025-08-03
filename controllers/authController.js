const { isEmpty } = require("tls");
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");
const { passwordHasher } = require("../service/hash.js");
const tokenization = require("../service/tokenGeneration.js");

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
  const passwordHash = passwordHasher(password);
  const validUser = new User({
    username: username,
    passwordHash: passwordHash,
    email: email,
    signUpDate: signUpDate,
  });
  try {
    await validUser.save();
    let token = tokenization({ id: validUser._id }, process.env.SECRET, {
      expiresIn: 10 * 60, // short
    });
    res
      .status(201)
      .json({ message: `Successfully registered ${validUser.username}!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "internal server error",
      errorMessage: err,
    });
  }
}
// creating the long lived token - refresh token
async function loginUser(req, res) {
  const { email, password } = req.body;
  const isValidDetails = email.length > 3 && password.length > 6 ? true : false;
  if (!isValidDetails) {
    res.status(400).json({
      errorMessage: "You have sent invalid email or password details.",
    });
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ errorMessage: "User does not exist!" });
  }
  const validPasswordAttempt = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!validPasswordAttempt) {
    return res.status(401).json({
      errorMessage: "Username or password is incorrect!",
    });
  }
  let refreshToken = tokenization({ id: user._id }, process.env.SECRET, {
    expiresIn: "7d",
  });
  let accessToken = tokenization({ id: user._id }, process.env.SECRET, {
    expiresIn: 30 * 60,
  });

  res.status(200).json({ token });
}

module.exports = {
  registerUser,
  loginUser,
};
