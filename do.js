/*do.js*/
var path = require('path');

var api = require('./api');
var util = require('./util');

var Evernote = require('evernote').Evernote;

var express = require('express');
var app = express();

// view engine setup
app.set('views', /*__dirname*/path.join(__dirname, 'manager'));
app.set('view engine', 'ejs'); //ejsを変える

app.get('/', function(req, res) {
  api.init(req, res);
  //res.render('index', { title: 'EvernoteAPI' });
  //res.send();
});
app.get('/manager', function (req, res) {
  var oauthParam = [];
  var oauth_verifier;
  oauthParam = req.url.split('&');
  oauthParam.forEach(function (data) {
    if (data.indexOf('oauth_verifier') > -1) {
      oauth_verifier = data.split('=')[1];
    }
  });
  //console.log(oauth_verifier);
  //api.access(api.oauthToken, api.oauthTokenSecret, oauth_verifier);
  api.client.getAccessToken(oauthToken, oauthTokenSecret, oauth_verifier, function(err, oauthAccessToken, oauthAccessTokenSecret, results) {
    // store 'oauthAccessToken' somewhere
    if (err) {
      console.log(err);
      return false;
    }
    /*
    console.log(oauthAccessToken);
    console.log(oauthAccessTokenSecret);
    console.log(results);
    */
    var clientAccess = new Evernote.Client({token: oauthAccessToken});
    var userStore = clientAccess.getUserStore();
    userStore.getUser(function(err, user) {
      // run this code
      console.log(user);
    });
    var noteStore = clientAccess.getNoteStore();
    notebooks = noteStore.listNotebooks(function(err, notebooks) {
      // run this code
      console.log(notebooks);
    });
  });
  res.render('index', { title: 'EvernoteAPI' });
  res.send();
});
app.listen(3000);//172.20.10.4
