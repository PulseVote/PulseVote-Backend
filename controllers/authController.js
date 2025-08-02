const { isEmpty } = require("tls");
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokenization = require("../service/tokenGeneration.js");
const nodeMailler = require("nodemailer");
const transporter = nodeMailler.createTransport({
  host: "gmail",
  secure: true,
  auth: {
    user: "shravanramjathan@gmail.com",
    pass: "myPassword",
  },
});

async function sendMail(sender, receivers, subject, content) {
  if (receivers.length == 0) {
    throw new Error("there are no receivers.");
  }
  const info = await transporter.sendMail({
    from: sender,
    to: receivers.join(", "), // we need to resolve this
    subject: subject,
    text: content,
  });
  console.log("Message Sent");
}

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
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const validUser = new User({
    username: username,
    passwordHash: passwordHash,
    email: email,
    signUpDate: signUpDate,
  });
  try {
    await validUser.save();
    let token = tokenization({ id: validUser._id }, process.env.SECRET, {
      expiresIn: process.env.TOKEN_LONG,
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
  let token = tokenization({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.TOKEN_SHORT,
  });

  res.status(200).json({ token });
}

module.exports = {
  registerUser,
  loginUser,
};
