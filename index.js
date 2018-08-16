const express = require("express");
var cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
var app = express();
const mongoose = require("mongoose");
const passport = require("passport");
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

//routes
const users = require("./routes/api/users");
const fb = require("./routes/api/fb");
const instagram = require("./routes/api/instagram");
const twitter = require("./routes/api/twitter");

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
