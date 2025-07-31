const express = require("express");
const router = express.router();
const { registerUser, loginUser } = require("../controllers/authController.js");
const timeLog = (req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
};
router.use(timeLog);

router.get("/", (req, res) => {
  res.send("Trying to authenticate...");
});

// we now added a router to these functions, so when this endpoint is called, that controller logic will run
router.get("/auth/register", registerUser);

router.get("/auth/login", loginUser);

module.exports = router;
