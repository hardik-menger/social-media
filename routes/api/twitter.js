const express = require("express");
const router = express.Router();
const Twitter = require("node-twitter-api");
const config = require("../../config/keys");
var multer = require("multer");
var User = require("../../models/User");
var TwitterAccount = require("../../models/TwitterAccounts");
var _requestSecret;
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("image-file");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

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
        let userData = {};
        twitter.verifyCredentials(accessToken, accessSecret, function(
          err,
          user
        ) {
          if (err) {
            console.log("Verification in get info error");
            res.status(500).send(err);
          } else {
            userData = user;
            let credentials = {
              accessToken,
              accessSecret,
              followers_count: userData.followers_count,
              friends_count: userData.friends_count,
              name: userData.name,
              screen_name: userData.screen_name,
              profile_image_url: userData.profile_image_url,
              id: userData.id
            };
            res.send(`<html>
            <body>
              <script>
                    window.opener.postMessage(${JSON.stringify(
                      credentials
                    )}, '*');
                    window.close();
               </script>
            </body>
          </html>`);
          }
        });
      }
    }
  );
});

//@route POST api/twitter/status
//@desc get access token and secret
//@access Public
router.post("/status", (req, res) => {
  const { status, accessToken, accessSecret } = req.body;
  twitter.statuses(
    "update",
    {
      status: status
    },
    accessToken,
    accessSecret,
    (error, data, response) => {
      if (error) {
        res.json(error.data);
      } else {
        res.send({ success: true });
      }
    }
  );
});

//@route POST api/twitter/file-upload
//@desc get image/base64/upload
//@access Public
router.post("/file-upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.json({ err });
    } else {
      if (req.file == undefined) {
        res.json({ err: "file not found error" });
      } else {
        let { accessSecret, accessToken } = JSON.parse(req.body.data);
        twitter.uploadMedia(
          {
            isBase64: false,
            media: `C:/hardik/social-media/uploads/${req.file.filename}`
          },
          accessToken,
          accessSecret,
          (error, data, response) => {
            if (error) {
              res.json(error.data);
            } else {
              twitter.statuses(
                "update",
                {
                  status: "status",
                  media_ids: data.media_id_string
                },
                accessToken,
                accessSecret,
                (error, data, response) => {
                  if (error) {
                    res.json(error.data);
                  } else {
                    res.send({ success: true });
                  }
                }
              );
            }
          }
        );
      }
    }
  });
});

//@route POST api/twitter/save-token
//@desc save token in twitteraccountcollection in db
//@access Public
router.post("/save-token", (request, response) => {
  TwitterAccount.updateOne(
    { username: request.body.twitterauth.username },
    { ...request.body.twitterauth },
    {
      upsert: true,
      new: true
    }
  )
    .then(res => {
      User.updateOne(
        { email: request.body.useremail },
        { twitteraccount: mongoose.Types.ObjectId(request.body.twitterid) },
        {
          upsert: true,
          new: true
        },
        (err, res) => {
          !err
            ? response.json({ success: true })
            : response.json({ err: "invalid credentials" });
        }
      );
    })
    .catch(e => {
      response.json({ error: e });
    });
});
module.exports = router;
