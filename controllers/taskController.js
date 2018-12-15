var mongoose = require("mongoose");
var User = require("../models/User");
var Account = require("../models/TwitterAccounts");
var Task = require("../models/Task");
// app.post('/api/add_task', taskController.postAddTask);
// params user_token, message, media, date (milliseconds in UTC timezone), account_ids,
exports.postAddTask = (req, res) => {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.status(401).send("Cannot find user.");
    } else if (err) {
      return res.send(err);
    }

    Account.find(
      { accountid: { $in: JSON.parse(req.body.account_ids) } },
      function(err, accounts) {
        if (err) return res.json(err);

        var task = new Task({
          user: user,
          accounts: accounts.map(obj => obj.accountid),
          message: req.body.message,
          date: req.body.date
        });
        task.save(function(err) {
          if (err) return res.send(err);
          //   task.sendTask();
          return res.send({ response: "OK" });
        });
      }
    );
  });
};
