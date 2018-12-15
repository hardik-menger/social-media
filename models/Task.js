var mongoose = require("mongoose");
const Twitter = require("node-twitter-api");
const config = require("../config/keys");
const Account = require("./TwitterAccounts");
var async = require("async");
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
  updatedAt: { type: Date, default: new Date() },
  date: { type: Date },
  processed: { type: Boolean }
});
taskSchema.methods = {
  sendTask: (accounts, message, media_path) => {
    self = this;
    Account.find({ accountid: { $in: JSON.parse(accounts) } }, function(
      err,
      accounts
    ) {
      if (err) return res.status(500).send("Cannot verify accounts.");
      async.eachSeries(accounts, function iterator(account, callback) {
        console.log("async", account.username);
        if (media_path) {
          //media post
          twitter.uploadMedia(
            {
              isBase64: false,
              media: media_path
            },
            account.token,
            account.secret,
            (error, data, response) => {
              if (error) {
                res.json(error.data);
              } else {
                console.log(data.media_id_string);
                twitter.statuses(
                  "update",
                  {
                    status: message,
                    media_ids: data.media_id_string
                  },
                  account.token,
                  account.secret,
                  (error, data, response) => {
                    if (error) {
                      console.error(error.data);
                    } else {
                      console.log({
                        success: true,
                        message,
                        time: new Date(),
                        media_posted: media_path
                      });
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
              status: message
            },
            account.token,
            account.secret,
            (error, data, response) => {
              if (error) {
                console.error(error.data);
              } else {
                console.log({ success: true, message, time: new Date() });
              }
            }
          );
        }
      });
    });
  }
};
module.exports = mongoose.model("tasks", taskSchema);
