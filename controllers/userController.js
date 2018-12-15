var mongoose = require("mongoose");
var User = require("../models/User");
var Account = require("../models/TwitterAccounts");

// app.get('/api/twitter/user_accounts', userController.getUserAccounts);
// params user_token
exports.getUserAccounts = function(req, res) {
  console.log("get accounts " + JSON.stringify(req.body));
  //TODO REMOVE ACCOUNTS WITH THE SAME USERNAME
  User.findOne({ email: req.body.email })
    .populate("twitteraccounts")
    .exec(function(err, user) {
      if (!user) {
        return res.status(401).send("Cannot verify user.");
      } else if (err) {
        return res.status(500).send(err);
      }

      return res.send({ accounts: user.twitteraccount });
    });
};
