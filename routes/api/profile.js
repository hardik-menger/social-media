const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
//profilemodel
const Profile = require("../../models/Profile");
//load user model
const User = require("../../models/User");
const router = express.Router();

//load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//@route GET api/profile/test
//@desc Tests profile route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

//get user data from token
//@route GET api/profile
//@desc get cuurent users profile
//@access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(e => res.status(404).json(e));
  }
);

//@route get api/profile/all
//@desc get all profiles
//@access public
router.get("/all", (req, res) => {
  errors = {};
  Profile.find({})
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (profiles) {
        res.send(profiles);
      } else {
        errors.profiles = "no profiles found";
        res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json({ profiles: "no profiles found" }));
});

//@route get api/profile/handle/:handle
//@desc get profile by handle
//@access public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noprofile = "there is no profile for this user";
        res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json({ msg: err }));
});

//@route get api/profile/user/:user_id
//@desc get profile by id
//@access public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noprofile = "there is no profile for this user";
        res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json({ msg: err }));
});

//make profile of user
//@route post api/profile
//@desc create or update user profile
//@access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //get fields

    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) {
      profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
      profileFields.company = req.body.company;
    }
    if (req.body.website) {
      profileFields.website = req.body.website;
    }
    if (req.body.location) {
      profileFields.location = req.body.location;
    }
    if (req.body.bio) {
      profileFields.bio = req.body.bio;
    }
    if (req.body.status) {
      profileFields.status = req.body.status;
    }
    if (req.body.githubusername) {
      profileFields.githubusername = req.body.githubusername;
    }

    //skills
    if (typeof req.body.skills != undefined) {
      profileFields.skills = req.body.skills.split(",");
    }

    //social
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update user
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            Profile.findOneAndUpdate(
              { user: req.user.id },
              { $set: profileFields },
              { new: true }
            )
              .then(profile => {
                res.json({ profile });
              })
              .catch(err => console.log(err));
          }
        });
      } else {
        //create user
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = "that handle already exists";
              res.status(400).json(errors);
            } else {
              //save
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile))
                .catch(err => {
                  res.send(err);
                });
            }
          })
          .catch(err => res.send(err));
      }
    });
  }
);
// @route   DELETE api/profile/experience/:exp:id
// @desc    Delete experience from profile profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        let removeindex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        profile.experience.splice(removeindex, 1);
        new Profile(profile)
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json({ error: err }));
      })
      .catch(err => res.json({ error: err }));
  }
);

// @route   DELETE api/profile/education/:education_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:education_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        let removeindex = profile.education
          .map(item => item.id)
          .indexOf(req.params.education_id);
        profile.education.splice(removeindex, 1);
        new Profile(profile)
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json({ error: err }));
      })
      .catch(err => res.json({ error: err }));
  }
);

//@route post api/profile/experience
//@desc add exp to profile
//@access provate
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          to: req.body.to,
          from: req.body.from,
          current: req.body.current,
          description: req.body.description
        };
        //add to exp array
        profile.experience.unshift(newExp);
        new Profile(profile)
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json({ error: err }));
      })
      .catch(err => res.json({ error: err }));
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Add to exp array
        profile.education.unshift(newEdu);

        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json({ error: err }));
      })
      .catch(err => res.json({ error: err }));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);
module.exports = router;
