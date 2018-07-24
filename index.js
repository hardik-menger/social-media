const express = require("express");
var cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
var app = express();

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//constants
const secret = require("./config/keys").secret;
const appid = require("./config/keys").appid;

//routes
const fb = require("./routes/api/fb");
const instagram = require("./routes/api/instagram");
const twitter = require("./routes/api/twitter");
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
