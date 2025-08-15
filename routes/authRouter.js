const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendMail,
  refreshToken,
  logoutUser,
} = require("../controllers/authController.js");
const refreshMiddle = require("../middleware/refresh.js");
const protection = require("../middleware/protected.js");
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
router.post("/refresh", refreshMiddle, refreshToken);
router.post("/logout", protection, logoutUser);
module.exports = router;
