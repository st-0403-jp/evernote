/*api.js*/
var request = require('request');
var token = require('./token');

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
  //http://0.0.0.0:8808/?oauth_token=sato252011-7217.154FB5065A8.687474703A2F2F302E302E302E303A383830382F.E61D1D800224D2A670A505284AD7211C&oauth_verifier=A01C205F572D38ADF5AAF9A202FC1A43&sandbox_lnb=false
})();

//request.get(options, function (error, response, body) {
