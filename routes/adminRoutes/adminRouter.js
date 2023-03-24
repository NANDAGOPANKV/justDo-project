const express = require("express");

const router = express.Router();

// custom modules
const {
  findUsers,
  adminSignInControll,
  deleteUser,
  saveAdminUser,
  updateAccount,
  updateAccountFind,
} = require("../../controller/adminController");
const { saveUser } = require("../../controller/userController");
const User = require("../../model/userModel");

// adminmiddleware
function adminCheckmiddleware(req, res, next) {
  if (!req.session.adminId) {
    res.redirect("/admin/signin");
  } else {
    next();
  }
}

// admin routes
router.get("/", adminCheckmiddleware, (req, res) => {
  let adminName = req.session.adminName;

  async function getUserData() {
    return new Promise(async (resolve, reject) => {
      let AllNewUsers = await User.find();
      resolve(AllNewUsers);
    });
  }

  getUserData().then((data) => {
    res.render("adminHome", { users: data, adminName });
  });
});

// admin signIn
router.get("/signin", (req, res) => {
  if (req.session.adminId) {
    res.redirect("/admin");
  } else {
    res.render("adminSignIn");
  }
});

// admin signIn/post admin data
router.post("/signin", adminSignInControll);

// admin signout
router.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/signin");
});

// addmin add users
router.get("/adminadduser", adminCheckmiddleware, (req, res) => {
  res.render("addminAddUser");
});

// addmin add users/post
router.post("/adminadduser", saveAdminUser);

// delete user
router.get("/delete/:id", deleteUser);

// update user
router.get("/update/:id", updateAccountFind);

// updated User
router.post("/updatedUser/:id", updateAccount);

module.exports = router;
