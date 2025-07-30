const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const reqUser = req.body;
  User.validate(reqUser).catch((error) =>
    res
      .status(400)
      .json({
        errorMessage: error,
        message: "You have made an invalid request by sending empty data!",
      })
      .send()
  );
  const { username, email, passwordHash, signUpDate } = reqUser;
  const emailExists = await User.findOne({ email: email }).exec();
  if (emailExists) {
    return res
      .status(409)
      .json({ message: "This email is already in use, please try again" });
  }
   

}
