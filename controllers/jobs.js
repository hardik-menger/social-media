var Task = require("../models/Task");

//CRON JOB FUNCTION
exports.tasks = function() {
  var cutoff = new Date();
  Task.find({ date: { $lt: cutoff }, processed: { $ne: true } }, function(
    err,
    tasks
  ) {
    if (!err) {
      for (i = 0; i < tasks.length; i++) {
        console.log("Tasks to process " + tasks.length);
        var task = tasks[i];

        task.processed = true;
        task.save();
        task.sendTask();
      }
    }
  });
};
