const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load user model
const User = require("../../models/User");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//@route GET api/users/test
//@desc Tests users route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

//@route post api/users/register
//@desc register user
//@access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email id alreay exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json({ message: "Successfully signed up" }))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route post api/users/login
//@desc login user
//@access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ email: "user not found" });
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name
            };

            jwt.sign(
              payload,
              keys.secretkey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            return res.status(400).json({ password: "Password incorrect" });
          }
        })
        .catch(err => console.log(`err in login ${err}`));
    })
    .catch(err => console.log(`err in login ${err}`));
});

//@route GET api/users/current
//@desc return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

//@route post api/users/add
//@desc add a profile
//@access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const type = req.body.type;
    const id = req.body.id;
    switch (type) {
      case "facebook":
        User.findByIdAndUpdate(
          req.user.id,
          { $addToSet: { facebookprofiles: { $each: [id] } } },
          { new: true, upsert: true }
        )
          .then(user => {
            res.json({ profiles: user.facebookprofiles });
          })
          .catch(err => res.json({ err }));
        break;
      case "instagram":
        User.findByIdAndUpdate(
          req.user.id,
          { $addToSet: { instagramprofiles: { $each: [id] } } },
          { new: true, upsert: true }
        )
          .then(user => {
            res.json({ profiles: user.instagramprofiles });
          })
          .catch(err => res.json({ err }));
        break;
      case "twitter":
        User.findByIdAndUpdate(
          req.user.id,
          { $addToSet: { twitterprofiles: { $each: [id] } } },
          { new: true, upsert: true }
        )
          .then(user => {
            res.json({ profiles: user.twitterprofiles });
          })
          .catch(err => res.json({ err }));
        break;
    }
  }
);

//@route post api/users/remove
//@desc remove a profile
//@access Private
router.post(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const type = req.body.type;
    const id = req.body.id;
    switch (type) {
      case "facebook":
        User.findById(req.user.id)
          .then(user => {
            removeIndex = user.facebookprofiles.map(id => id).indexOf(id);
            if (removeIndex != -1) {
              user.facebookprofiles.splice(removeIndex, 1);
              user
                .save()
                .then(user => res.json(user.facebookprofiles))
                .catch(err => res.json(err));
            } else {
              res.json({ error: "id incorrect" });
            }
          })
          .catch(err => res.json({ err }));
        break;
      case "instagram":
        User.findById(req.user.id)
          .then(user => {
            removeIndex = user.instagramprofiles.map(id => id).indexOf(id);
            if (removeIndex != -1) {
              user.instagramprofiles.splice(removeIndex, 1);
              user
                .save()
                .then(user => res.json(user.instagramprofiles))
                .catch(err => res.json(err));
            } else {
              res.json({ error: "id incorrect" });
            }
          })
          .catch(err => res.json({ err }));
        break;
      case "twitter":
        User.findById(req.user.id)
          .then(user => {
            removeIndex = user.twitterprofiles.map(id => id).indexOf(id);
            if (removeIndex != -1) {
              user.twitterprofiles.splice(removeIndex, 1);
              user
                .save()
                .then(user => res.json(user.twitterprofiles))
                .catch(err => res.json(err));
            } else {
              res.json({ error: "id incorrect" });
            }
          })
          .catch(err => res.json({ err }));
        break;
    }
  }
);

module.exports = router;
