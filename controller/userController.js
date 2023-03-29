const User = require("../model/userModel");

// save user
const saveUser = async (req, res) => {
  let userRes;

  let userReqObj = {
    emailId: req.body.email,
    password: req.body.password,
    name: req.body.username,
    phone: req.body.phone,
  };

  const findSameUser = await User.findOne({ email: userReqObj.emailId });

  if (findSameUser != null || findSameUser != undefined) {
    res.render("userSignup", { exists: true });
  } else {
    const usersDB = new User({
      name: userReqObj.name,
      email: userReqObj.emailId,
      password: userReqObj.password,
      phone: userReqObj.phone,
    });

    userRes = await usersDB.save();
    req.session.userData = userRes;
    req.session.userLogged = true;
    res.redirect("/signin");
  }
};
// save user

// signin user
const userSignInControll = async (req, res) => {
  // user sign in object
  let userReqObj = {
    emailId: req.body.email,
    password: req.body.password,
  };

  const findSameUser = await User.findOne({ email: userReqObj.emailId });

  if (findSameUser != null || findSameUser != undefined) {
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
      .catch((err) => {
        res.redirect("/signin")
      });
  } else {
    res.render("userSignIn", { exists: true });
  }
};

module.exports = { saveUser, userSignInControll };
