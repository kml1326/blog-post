const User = require("../models/User");
const passport = require("passport");

module.exports = {
  signup: (req, res) => {
    console.log(req.body, "req.body");
    const newUser = new User(req.body);
    newUser.save((err, data) => {
      if (err) throw err;
      else {
        return res.status(200).json({
          message: "signup successfull"
        });
      }
    });
  },

  login: (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .send({ message: "Ple3ase Check User Name or Password" });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.json({ user: req.user });
      });
    })(req, res, next);
  },

  isLoggedIn: (req, res) => {
    console.log(req.user, "req user for check user");
    User.findOne({ _id: req.user._id }, { password: 0 }, function(err, user) {
      if (err) throw err;
      res.json({ user: user });
    });
  }
};
