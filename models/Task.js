var mongoose = require("mongoose");
const Twitter = require("node-twitter-api");
const config = require("../config/keys");
const Account = require("./TwitterAccounts");
var Schema = mongoose.Schema;
var twitter = new Twitter({
  consumerKey: config.twitterConsumerkey,
  consumerSecret: config.twitterConsumerSecret,
  callback: "http://localhost:3001/api/twitter/access-token"
});
var taskSchema = new mongoose.Schema({
  accounts: [{ type: Number }],
  user: { type: Schema.ObjectId, ref: "users" },
  message: { type: String },
  media_path: { type: String },
  updatedAt: { type: Date, default: Date.now },
  date: { type: Date },
  processed: { type: Boolean }
});
taskSchema.methods = {
  sendTask: () => {
    self = this;
    Account.find({ accountid: { $in: JSON.parse(self.accounts) } }, function(
      err,
      accounts
    ) {
      if (err) return res.status(500).send("Cannot verify accounts.");
      async.eachSeries(accounts, function iterator(account, callback) {
        if (self.media_path && self.media_path.length > 0) {
          //media post
          twitter.uploadMedia(
            {
              isBase64: false,
              media: self.media_path
            },
            account.token,
            account.secret,
            (error, data, response) => {
              if (error) {
                res.json(error.data);
              } else {
                twitter.statuses(
                  "update",
                  {
                    status: self.message,
                    media_ids: data.media_id_string
                  },
                  account.token,
                  account.secret,
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
        } else {
          //status post
          twitter.statuses(
            "update",
            {
              status: self.message
            },
            account.token,
            account.secret,
            (error, data, response) => {
              if (error) {
                res.json(error.data);
              } else {
                res.send({ success: true });
              }
            }
          );
        }
      });
    });
  }
};
module.exports = mongoose.model("tasks", taskSchema);
