const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
var cors = require("cors");
const path = require("path");
//routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
var app = express();

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//mongodb
const db = require("./config/keys").mongoURI;
//connect
mongoose
  .connect(db)
  .then(() => console.log("connected  to database"))
  .catch(err => console.log("err occured in connecting " + err));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

// app.get("/", (req, res) => {
//   res.send("hello");
// });

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
//Server static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`running server on  ${port}`));
