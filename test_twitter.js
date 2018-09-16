var OAuth = require("oauth");

var twitter_application_consumer_key = "DDticQ4kgzrOv3qxOmh1YkFlS"; // API Key
var twitter_application_secret =
  "g3VyFmnb5TbrNl2UWfixawx6Su3CCOMThQwAWWYcAzRgwok5iq"; // API Secret
var twitter_user_access_token =
  "2932654645-EtBYgiNyFbVMPwftFYGXsynstjzsANEgLsINS7Z"; // Access Token
var twitter_user_secret = "UAJBmixxFE0ssAuHUURmIlV8tYjvgetRnfbFoCWOlBvLF"; // Access Token Secret

var oauth = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  twitter_application_consumer_key,
  twitter_application_secret,
  "1.0A",
  null,
  "HMAC-SHA1"
);

var status = "this is a test tweet"; // This is the tweet (ie status)

var postBody = {
  status: status
};

// console.log('Ready to Tweet article:\n\t', postBody.status);
oauth.post(
  "https://api.twitter.com/1.1/statuses/update.json",
  twitter_user_access_token, // oauth_token (user access token)
  twitter_user_secret, // oauth_secret (user secret)
  postBody, // post body
  "", // post content type ?
  function(err, data, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  }
);
