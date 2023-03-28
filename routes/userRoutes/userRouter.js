const express = require("express");
const {
  saveUser,
  userSignInControll,
} = require("../../controller/userController");

const router = express.Router();

// middleware for user check
function userCheckMiddleWare(req, res, next) {
  if (!req.session.userStatus) {
    res.redirect("/signin");
  } else {
    next();
  }
}

// server routes
router.get("/", userCheckMiddleWare, (req, res) => {
  const { name } = req.session.userData;
  res.render("userHome", { name });
});

router.get("/signin", (req, res) => {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.render("userSignIn");
  }
});

router.post("/signin", userSignInControll);

router.get("/signup", (req, res) => {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.render("userSignup");
  }
});

router.post("/signup", userCheckMiddleWare, saveUser);
// req.session.user =

router.get("/signout", userCheckMiddleWare, (req, res) => {
  req.session.destroy();

  res.redirect("/signin");
});

module.exports = router;
