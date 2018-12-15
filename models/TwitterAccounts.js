var mongoose = require("mongoose");

var accountSchema = new mongoose.Schema({
  username: { type: String },
  type: { type: String },
  secret: { type: String },
  token: { type: String },
  profile_image_url: { type: String },
  updatedAt: { type: Date, default: Date.now },
  accountid: { type: Number }
});

module.exports = mongoose.model("twitteraccounts", accountSchema);
