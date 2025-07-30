const { isEmpty } = require("tls");
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function validateUser(reqUser) {
  return User.validate(reqUser).catch((error) =>
    res
      .status(400)
      .json({
        errorMessage: error,
        message: "You have made an invalid request by sending empty data!",
      })
      .send()
  );
}
function createUser(validUserReq) {
  return new User({
    passwordHash: validUserReq.passwordHash,
    username: validUserReq.username,
    email: validUserReq.email,
    signUpDate: validUserReq.signUpDate,
  });
}
async function registerUser(req, res) {
  const reqUser = req.body;
  validateUser(reqUser);
  const { username, email, passwordHash, signUpDate } = reqUser;
  const emailExists = await User.findOne({ email: email }).exec();
  if (emailExists) {
    return res
      .status(409)
      .json({ message: "This email is already in use, please try again" });
  }
  const validUser = createUser(reqUser);

  validUser
    .save()
    .catch((err) =>
      res
        .status(500)
        .json({
          message: "internal server error",
          errorMessage: err,
        })
        .send()
    )
    .then(
      res
        .status(201)
        .json({ message: `Successfully registered ${validUser.username}!` })
    );
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const isValidDetails = email.length > 3 && password.length > 6 ? true : false;
  if (!isValidDetails) {
    res
      .status(400)
      .json({
        errorMessage: "You have sent invalid email or password details.",
      })
      .send();
  }
  const user = await User.findOne({ email: email });

  if (user == null) {
    res.status.json({ errorMessage: "User does not exist!" }).send();
  }
  const validPasswordAttempt = bcrypt.compare(password, user.passwordHash);
  if (!validPasswordAttempt) {
    res
      .status(401)
      .json({
        errorMessage: "Username or password is incorrect!",
      })
      .send();
  }
  
}
