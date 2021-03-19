const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
//load input validation
const validateRegisterInput = require('../../validation/register')

//Get Api
//@desc test post route
//access public
router.get("/test", (req, res) => {
  res.json({ msg: "hello" });
});
//Post Api
//@desc register User
//access public
router.post("/register", (req, res) => {
  const {errors,isValid} = validateRegisterInput(req.body)
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ email: "email already there ! not registered" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.json(user);
            })
            .catch((err) => {
              res.json(err);
            });
        });
      });
    }
  });
});

//Get Api/users/login
//@descLogin User /return JWT
//access public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find User
  User.findOne({ email }).then((user) => {
    // check for user
    if (!user) {
      return res.status(404).json({ email: "email not exist" });
    }
    //Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // res.json({msg:"success"})
        //User Match
        let payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }; //create JWT payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 36000 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        res.status(400).json({ msg: "password not matching" });
      }
    });
  });
});

//Get Api/users/current
//@descLogin return current user
//access public
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
