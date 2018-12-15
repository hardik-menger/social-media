const express = require("express");
(cors = require("cors")),
  (path = require("path")),
  (bodyParser = require("body-parser")),
  (app = express()),
  (mongoose = require("mongoose")),
  (passport = require("passport")),
  //routes
  (users = require("./routes/api/users")),
  (fb = require("./routes/api/fb")),
  (instagram = require("./routes/api/instagram")),
  (twitter = require("./routes/api/twitter")),
  (CronJob = require("cron").CronJob);

//mongodb
const db = require("./config/keys").mongoURI;
const jobController = require("./controllers/jobController");
//connect
mongoose
  .connect(db)
  .then(() => console.log("connected  to database"))
  .catch(err => console.log("err occured in connecting " + err));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", users);
app.use("/api/fb", fb);
app.use("/api/instagram", instagram);
app.use("/api/twitter", twitter);

//Server static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 3001;

new CronJob(
  "0 * * * * *",
  function() {
    jobController.tasks();
  },
  null,
  true,
  null
);

app.listen(port, () => console.log(`running server on  ${port}`));
