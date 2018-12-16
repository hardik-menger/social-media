const express = require("express");
const router = express.Router();
const Twitter = require("node-twitter-api");
const config = require("../../config/keys");
var multer = require("multer");
var User = require("../../models/User");
var Task = require("../../models/Task");
var TwitterAccount = require("../../models/TwitterAccounts");
const userController = require("../../controllers/userController");
const taskController = require("../../controllers/taskController");
const passport = require("passport");
const fs = require("fs");
var _requestSecret;
const port = process.env.PORT || 3001;
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./routes/api/uploads/",
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
  callback: `https://riidlfbproject.herokuapp.com/api/twitter/access-token`
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
          requestToken,
        port
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
router.post(
  "/status",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { email, account_ids } = req.body;
    User.findOne({ email }, (err, user) => {
      if (!user) {
        return res.status(401).send("Cannot verify user.");
      } else if (err) {
        return res.status(500).send(err);
      }

      console.log("received params_1");

      Account.find({ _id: { $in: account_ids } }, (err, accounts) => {
        if (err) return res.status(500).send("Cannot verify accounts.");

        var task = new Task({
          user: user,
          accounts: accounts,
          message: req.body.message,
          date: new Date(req.body.date)
        });
        task.save(function(err) {
          if (err) return res.status(500).send(err);
          task.sendTask();
          return res.send({ response: "OK" });
        });
      });
    });
  }
);

//@route POST api/twitter/file-upload
//@desc get image/base64/upload
//@access Public
router.post(
  "/file-upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("reached?auth err?");
    upload(req, res, err => {
      if (err) {
        res.json({ err });
      } else {
        if (req.file == undefined) {
          res.json({ err: "file not found error" });
        } else {
          let { email, account_ids, message, date } = JSON.parse(req.body.data);
          date = new Date(date);
          User.findOne({ email }, function(err, user) {
            if (!user) {
              return res.status(401).send("Cannot find user.");
            } else if (err) {
              return res.send(err);
            }

            TwitterAccount.find(
              { accountid: { $in: JSON.parse(account_ids) } },
              function(err, accounts) {
                if (err) return res.json(err);

                var task = new Task({
                  user: user,
                  accounts: accounts.map(obj => obj.accountid),
                  message,
                  date,
                  media_path: path.resolve(
                    __dirname + `/uploads`,
                    req.file.filename
                  )
                });

                task.save(function(err) {
                  if (err) return res.send(err);
                  //   task.sendTask();
                  return res.send({ response: "OK" });
                });
              }
            );
          });
          // twitter.uploadMedia(
          //   {
          //     isBase64: false,
          //     media: `C:/hardik/social-media/uploads/${req.file.filename}`
          //   },
          //   accessToken,
          //   accessSecret,
          //   (error, data, response) => {
          //     if (error) {
          //       res.json(error.data);
          //     } else {
          //       twitter.statuses(
          //         "update",
          //         {
          //           status: "status",
          //           media_ids: data.media_id_string
          //         },
          //         accessToken,
          //         accessSecret,
          //         (error, data, response) => {
          //           if (error) {
          //             res.json(error.data);
          //           } else {
          //             res.send({ success: true });
          //           }
          //         }
          //       );
          //     }
          //   }
          // );
        }
      }
    });
  }
);

//@route POST api/twitter/save-token
//@desc save token in twitteraccountcollection in db
//@access Public
router.post(
  "/save-token",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    //  console.log(request.body.twitterid);
    TwitterAccount.update(
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
          {
            $addToSet: {
              twitteraccount: request.body.twitterid
            }
          },
          (err, res) => {
            !err ? response.json(res) : response.json({ err });
          }
        );
      })
      .catch(e => {
        response.json({ error: e });
      });
  }
);

router.post("/user_accounts", userController.getUserAccounts);
router.post("/post_task", taskController.postAddTask);
module.exports = router;
