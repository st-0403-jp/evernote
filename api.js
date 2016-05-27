/*api.js*/
var request = require('request');
var fs = require('fs');
//自分便利モジュール
//var util = require('./util');
//コンソールに綺麗に出力する
//var show = require('./showConsole');
//evernote
var Evernote = require('evernote').Evernote;

module.exports = (function () {
  var method = {};

  method.init = function (req, res) {
    var client = new Evernote.Client({
      consumerKey: 'sato252011-7217',
      consumerSecret: '52dba2f462408a5d',
      sandbox: true // Optional (default: true)
    });
    client.getRequestToken('http://10.17.208.153:3000/model', function(err, oauthToken, oauthTokenSecret, results) {
      // store tokens in the session
      if (err) {
        console.log(err);
        return false;
      }
      //console.log(client.getAuthorizeUrl(oauthToken));
      res.redirect(client.getAuthorizeUrl(oauthToken));
      /*
      console.log(oauthToken);
      console.log(oauthTokenSecret);
      console.log(results);
      */
      /*
      client.getAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        // store 'oauthAccessToken' somewhere
      });
      */
    });
  };

  return method;
})();

//request.get(options, function (error, response, body) {
