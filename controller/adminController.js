const Admin = require("../model/adminModel");
const User = require("../model/userModel");

// find all users
const findUsers = new Promise(async (resolve, reject) => {
  let usersList = await User.find();

  resolve(usersList);
});

// get users List
function usersList(req, res) {
  return new Promise(async (resolve, reject) => {
    let usersList2 = await User.find();
    resolve(usersList2);
  });
}

// save admin user
const saveAdminUser = async (req, res) => {
  let userRes;
  try {
    const users = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    });

    userRes = await users.save();
    console.log(userRes);
    req.session.userData = userRes;
    req.session.userLogged = true;
    res.redirect("/admin");
  } catch (error) {
    res.send(error.message);
  }
};
// save admin user

const adminSignInControll = async (req, res) => {
  let adminObj = {
    emailId: req.body.email,
    password: req.body.password,
  };

  function signIn() {
    return new Promise((resolve, reject) => {
      const checkingCondition = async () => {
        let adminDB = await Admin.findOne({
          email: adminObj.emailId,
          password: adminObj.password,
        });

        if (adminDB == null) {
          reject("admin coudn't find");
          req.session.userStatus = false;
        } else {
          if (
            adminObj.emailId == adminDB.email &&
            adminObj.password == adminDB.password
          ) {
            (req.session.adminId = adminDB._id),
              (req.session.adminName = adminDB.name),
              resolve("id from db assigned to session adminId");
          } else {
            console.log("error cant connect to admin");
          }
        }
      };
      checkingCondition();
    });
  }
  signIn()
    .then(() => {
      res.redirect("/admin");
    })
    .catch(() => {
      res.redirect("/admin/signin");
    });
};

// deleteUser
const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/admin");
    })
    .catch(() => {
      res.send("error");
    });
};

// updateUser
const updateAccountFind = async (req, res) => {
  const id = req.params.id;
  const editUser = await User.findById(id);
  res.render("adminUserEdit", { user: editUser });
};

// updator function
const updateAccount = async (req, res) => {
  let id = req.params.id;

  let objUpadate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const updatedUser = await User.findByIdAndUpdate(id, {
    name: objUpadate.name,
    email: objUpadate.email,
    phone: objUpadate.phone,
  })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err) => {
      res.send(err.message);
    });
};

module.exports = {
  findUsers,
  adminSignInControll,
  saveAdminUser,
  deleteUser,
  updateAccountFind,
  updateAccount,
};
//updatedUser
