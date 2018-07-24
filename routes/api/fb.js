const express = require("express");
const router = express.Router();
//constants
const secret = require("../../config/keys").secret;
const appid = require("../../config/keys").appid;

router.get("/auth", function(req, res) {
  var redirect_uri = "http://localhost:3000/fb/pages";
  // For eg. "http://localhost:3000/facebook/callback"
});
router.get("/pages", (req, res) => {});
module.exports = router;
