const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
//profilemodel
const Profile = require("../../models/Profile");
//load user model
const User = require("../../models/User");
//load post model
const Post = require("../../models/Post");

//validate a post
const validatePostInput = require("../../validation/post");
//@route GET api/posts/test
//@desc Tests posts route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "post works" }));

//@route post api/posts
//@desc post a post
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    newPost = {
      text: req.body.text,
      name: req.body.name,
      user: req.user.id,
      avatar: req.body.avatar
      //   link : req.body.link,
      //   likes : req.body.likes,
      //   comment : req.body.omment,
      //   date : req.body.date
    };
    new Post(newPost)
      .save()
      .then(post => res.json(post))
      .catch(err => res.status(404).json({ error: "error occured" }));
  }
);

//@route delete api/posts/comment/:postid/:id
//@desc delete comment with given id
//@access private
router.delete(
  "/comment/delete/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        new Post(post).save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);
//@route get api/posts
//@desc see all posts
//@access public
router.get("/", (req, res) => {
  Post.find({})
    .populate("user", ["name", "avatar"])
    .sort({ date: "desc" })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ error: "error occured" }));
});

//@route get api/posts/:postid
//@desc see post with given id
//@access public
router.get("/:postid", (req, res) => {
  Post.findOne({ _id: req.params.postid })
    .then(post => {
      if (post) res.json(post);
      else res.status(404).json({ error: "post not found" });
    })
    .catch(err => res.status(404).json({ error: "error occured" }));
});

//@route delete api/posts/delete/:postid
//@desc delete with given id
//@access private
router.delete(
  "/delete/:postid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById({ _id: req.params.postid })
      .then(post => {
        if (post) {
          if (post.user == req.user.id) {
            Post.findByIdAndRemove({ _id: req.params.postid })
              .then(deleted => res.json(deleted))
              .catch(err =>
                res.json({ error: "error occured while deleting the post" })
              );
          } else {
            res
              .status(401)
              .json({ notauthorized: "not the owner of this post" });
          }
        } else {
          res.status(404).json({ error: "post not found" });
        }
      })
      .catch(err => res.status(404).json({ error: "error occured" }));
  }
);

//@route delete api/posts/like/:postid
//@desc like with given id
//@access private
router.post(
  "/like/:postid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.postid)
      .then(post => {
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);
        if (removeIndex == -1) {
          post.likes.push({ user: req.user.id });
        } else {
          post.likes.splice(removeIndex, 1);
        }
        new Post(post)
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(404).json({ error: "error occured" }));
      })
      .catch(err => res.status(404).json({ error: "error occured" }));
  }
);

//@route post api/posts/comment/:postid
//@desc comment with given id
//@access private
router.post(
  "/comment/:postid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.postid)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        post.comments.push(newComment);
        new Post(post)
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(404).json({ error: "error occured" }));
      })
      .catch(err => res.status(404).json({ error: "error occured" }));
  }
);

module.exports = router;
