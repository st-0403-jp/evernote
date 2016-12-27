/*api.js*/
var request = require('request');
var token = require('./token/token.js');

//evernote
var Evernote = require('evernote').Evernote;

console.log(token);
var client = new Evernote.Client(token);
var callbackIp = 'http://127.0.0.1:3000/manager/';// 'http://192.168.179.2:3000/manager/''http://10.17.209.13:3000/manager/'

module.exports = (function () {
  var method = {};

  method.client = client;

  method.oauthToken = null;

  method.oauthTokenSecret = null;

  method.init = function (req, res) {
    client.getRequestToken(callbackIp, function(err, oauthToken, oauthTokenSecret, results) {
      // store tokens in the session
      if (err) {
        console.log(err);
        return false;
      }
      MY_OAUTH_TOKEN = oauthToken;
      MY_OAUTH_TOKEN_SECRET = oauthTokenSecret;
      //evernoteと連携する
      res.redirect(client.getAuthorizeUrl(oauthToken));
    });
  };

  return method;
})();
