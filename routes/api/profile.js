const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const profile = require("../../models/profile");
const user = require("../../models/user");
router.get("/test", (req, res) => {
  res.json({ msg: "hello" });
});
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    profile
      .findOne({ user: req.user.id })
      .then((profile) => {
        errors.noProfile = "There is no Profile";
        if (!profile) {
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

//Create
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        profile
          .findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
          .then((profile) => {
            res.json(profile);
          });
      } else {
        profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "that handle already exist";
            res.status(400).json(errors);
          }
          new profile(profileFields).save().then((profile) => {
            res.json(profile);
          });
        });
      }
    });
  }
);
module.exports = router;
