/*api.js*/
var request = require('request');
var fs = require('fs');
//自分便利モジュール
//var util = require('./util');
//コンソールに綺麗に出力する
//var show = require('./showConsole');
//evernote
var Evernote = require('evernote').Evernote;

var client = new Evernote.Client({
  consumerKey: 'sato252011-7373',//'sato252011-7217',
  consumerSecret: 'a59a91f11f6b3d5e',//'52dba2f462408a5d',
  sandbox: true // Optional (default: true)
});

module.exports = (function () {
  var method = {};

  method.client = client;

  method.oauthToken = null;

  method.oauthTokenSecret = null;

  method.init = function (req, res) {
    client.getRequestToken('http://192.168.179.2:3000/manager/'/*'http://10.17.208.153:3000/manager/'*/, function(err, oauthToken, oauthTokenSecret, results) {
      // store tokens in the session
      if (err) {
        console.log(err);
        return false;
      }
      //セットパラメータ
      /*
      console.log(oauthToken);
      console.log(oauthTokenSecret);
      console.log(results);
      */
      this.oauthToken = oauthToken;
      this.oauthTokenSecret = oauthTokenSecret;
      //evernoteと連携する
      res.redirect(client.getAuthorizeUrl(oauthToken));
    });
  };

  method.access = function (oauthToken, oauthTokenSecret, oauthVerifier) {
    client.getAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      // store 'oauthAccessToken' somewhere
      console.log(oauthAccessToken);
      console.log(oauthAccessTokenSecret);
      console.log(results);
    });
  };

  return method;
  //http://0.0.0.0:8808/?oauth_token=sato252011-7217.154FB5065A8.687474703A2F2F302E302E302E303A383830382F.E61D1D800224D2A670A505284AD7211C&oauth_verifier=A01C205F572D38ADF5AAF9A202FC1A43&sandbox_lnb=false
})();

//request.get(options, function (error, response, body) {
