var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
  account: { type: Schema.ObjectId, ref: "TwitterAccount" },
  user: { type: Schema.ObjectId, ref: "User" },
  message: { type: String },
  media_path: { type: String },
  updatedAt: { type: Date, default: Date.now },
  date: { type: Date },
  processed: { type: Boolean }
});

module.exports = mongoose.model("tasks", taskSchema);
