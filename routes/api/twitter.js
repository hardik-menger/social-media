const express = require("express");
const router = express.Router();
const Twitter = require("node-twitter-api");
const config = require("../../config/keys");
var multer = require("multer");
const fs = require("fs");
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
        const credentials = {
          accessToken,
          accessSecret
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
    }
  );
});

//@route POST api/twitter/status
//@desc get access token and secret
//@access Public
router.post("/status", (req, res) => {
  // var b64content = fs.readFileSync("/path/to/img", { encoding: "base64" });
  const { status, accessToken, accessSecret } = req.body;
  twitter.statuses(
    "update",
    {
      status: status,
      media_ids: "1069680854794784769"
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
      console.log(err);
    } else {
      if (req.file == undefined) {
        console.log("file not found error");
      } else {
        var b64content = fs.readFileSync(
          `C:/hardik/social-media/uploads/${req.file.filename}`,
          { encoding: "base64" }
        );
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
              console.log(data);
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
module.exports = router;
