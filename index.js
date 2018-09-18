const express = require("express");
var cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
var app = express();
const mongoose = require("mongoose");
const passport = require("passport");
var session = require("express-session");
//routes
const users = require("./routes/api/users");
const fb = require("./routes/api/fb");
const instagram = require("./routes/api/instagram");
const twitter = require("./routes/api/twitter");

//mongodb
const db = require("./config/keys").mongoURI;

//connect
mongoose
  .connect(db)
  .then(() => console.log("connected  to database"))
  .catch(err => console.log("err occured in connecting " + err));

//session
app.use(
  session({
    name: "sid",
    secret: "zPLaW.....e",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000
    }
  })
);

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
app.listen(port, () => console.log(`running server on  ${port}`));
