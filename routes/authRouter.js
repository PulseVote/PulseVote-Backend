const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendMail,
} = require("../controllers/authController.js");
const timeLog = (req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
};
router.use(timeLog);

router.get("/", (req, res) => {
  res.send("Trying to authenticate...");
});
// i will add mailing later, focusing on react.
//router.get("/mail", sendMail);
// we now added a router to these functions, so when this endpoint is called, that controller logic will run
router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
