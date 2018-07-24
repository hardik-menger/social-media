const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
//constants
const secret = require("../../config/keys").secret;
const appid = require("../../config/keys").appid;

router.get("/auth", function(req, res) {
  fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${appid}&client_secret=${secret}&grant_type=fb_exchange_token&fb_exchange_token=${userAccessToken}`
  ).then(response =>
    response.json().then(res => console.log(res.data.access_token))
  );
});
router.get("/pages", (req, res) => {});
module.exports = router;
