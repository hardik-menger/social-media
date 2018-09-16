const express = require("express");
const router = express.Router();
const Twitter = require("node-twitter-api");
const config = require("../../config/keys");
var _requestSecret;
var twitter = new Twitter({
  consumerKey: config.twitterConsumerkey,
  consumerSecret: config.twitterConsumerSecret,
  callback: "http://localhost:3001/api/twitter/access-token"
});

//@route GET api/twitter/test
//@desc Tests users route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

//@route GET api/twitter/request-token
//@desc get request token
//@access Public
router.get("/request-token", (req, res) => {
  twitter.getRequestToken((err, requestToken, requestSecret) => {
    if (err) res.status(500).send(err);
    else {
      _requestSecret = requestSecret;

      res.json({
        url:
          "https://api.twitter.com/oauth/authenticate?oauth_token=" +
          requestToken
      });
    }
  });
});

//@route GET api/twitter/access-token
//@desc callback
//@access Public
router.get("/access-token", function(req, res) {
  var requestToken = req.query.oauth_token,
    verifier = req.query.oauth_verifier;

  twitter.getAccessToken(requestToken, _requestSecret, verifier, function(
    err,
    accessToken,
    accessSecret
  ) {
    if (err) res.status(500).send(err);
    else {
      req.query.accessToken = accessToken;
      req.query.accessSecret = accessSecret;
      res.send("<script>window.close()</script>");
    }
  });
});

//@route GET api/twitter/credentials
//@desc get access token and secret
//@access Public
router.get("/credentials", (req, res) => {
  if (req.query.accessSecret && req.query.accessToken) {
    res.json(req.query);
  } else {
    res.json({
      success: false
    });
  }
});

module.exports = router;
