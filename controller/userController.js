const User = require("../model/userModel");

// save user
const saveUser = async (req, res) => {
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
    res.redirect("/signin");
  } catch (error) {
    res.send(error.message);
  }
};
// save user

// get users
const promiseGetData = new Promise(async (resolve, reject) => {
  let userRes = await User.find();
  if (userRes) {
    resolve(userRes);
  } else {
    reject("error");
  }
});

// signin user
const userSignInControll = async (req, res) => {
  // user sign in object
  let userReqObj = {
    emailId: req.body.email,
    password: req.body.password,
  };

  function sigIn() {
    return new Promise((resolve, reject) => {
      const checkingCondition = async () => {
        let userDataDB = await User.findOne({
          email: userReqObj.emailId,
          password: userReqObj.password,
        });

        if (userDataDB == null) {
          reject("data coudn't find");
          req.session.userStatus = false;
        } else {
          if (
            userReqObj.emailId == userDataDB.email &&
            userReqObj.password == userDataDB.password
          ) {
            req.session.userId = userDataDB._id;
            req.session.userData = userDataDB;
            req.session.userStatus = true;
            resolve("id from db assigned to session userId");
          } else {
            console.log("error can't connect to user");
          }
        }
      };

      checkingCondition();
    });
  }
  sigIn()
    .then(() => {
      res.redirect("/");
    })
    .catch(() => {
      res.redirect("/signin");
    });
};

module.exports = { saveUser, promiseGetData, userSignInControll };
