const express = require("express");
const router = express.Router();
const Twitter = require("node-twitter-api");
const config = require("../../config/keys");
// var session = require("express-session");
// var cookieParser = require("cookie-parser");
// router.use(cookieParser());
// router.use(
//   session({
//     secret: "2C44-4D44-WppQ38S",
//     resave: false,
//     saveUninitialized: true
//   })
// );
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
      res.send({
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

router.get("/access-token", (req, res) => {
  var requestToken = req.query.oauth_token,
    verifier = req.query.oauth_verifier;

  twitter.getAccessToken(
    requestToken,
    _requestSecret,
    verifier,
    (err, accessToken, accessSecret) => {
      if (err) res.status(500).send(err);
      else {
        req.session.twitterAccessToken = accessToken;
        req.session.twitterAccessSecret = accessSecret;
        res.send(`<html>
                    <body>
                      <script>
                          var data = "test";
                          Window.opener.postMessage(data, 'http://localhost:3001');
                          window.close();

                      </script>
                    </body>
                  </html>`);
        console.log(req.session.id, req.session.twitterAccessToken);
        // res.status(200).send(req.session);
      }
    }
  );
});

//@route GET api/twitter/credentials
//@desc get access token and secret
//@access Public
router.get("/credentials", (req, res) => {
  console.log(req.session.id, req.session.twitterAccessToken);
  res.send(req.session);
});

module.exports = router;
