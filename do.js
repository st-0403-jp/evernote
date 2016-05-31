/*do.js*/
var path = require('path');

var api = require('./api');
var util = require('./util');

var Evernote = require('evernote').Evernote;
var enml = require('enml-js');

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
    //console.log(oauthToken);
    //console.log(oauthAccessToken);
    var clientAccess = new Evernote.Client({token: oauthAccessToken});
    /*
    var userStore = clientAccess.getUserStore();
    userStore.getUser(function(err, user) {
      // run this code
      //console.log(user);
    });
    */
    var noteStore = clientAccess.getNoteStore();
    var noteFilter = new Evernote.NoteFilter();
    var notesMetadataResultSpec = new Evernote.NotesMetadataResultSpec({
        includeTitle: true
    });
    var pageSize = 10;
    noteStore.findNotesMetadata(oauthAccessToken, noteFilter, 0, pageSize, notesMetadataResultSpec, function(err, notesData) {
        if (err) {
            console.log(err);
            return false;
        }
        noteStore.getNote(notesData.notes[1].guid, true, true, true, true, function(err, note) {
            console.log(err || note);
            var noteHtml = enml.HTMLOfENML(note.content, note.resources);
            res.render('index', { title: 'EvernoteAPI', note: notesData.notes[1].title, html: noteHtml });
            res.send();
        });
        //console.log(notesData.getNotes());
        /*
        int matchingNotes = notes.getTotalNotes();
        int notesThisPage = notes.getNotes().size();

        for (NoteMetadata note : notes.getNotes()) {
            System.out.println(note.getTitle());
        }
        */
    });
    /*
    noteStore.listNotebooks(function(err, notebooks) {
      // run this code
      console.log(notebooks);
    });
    */
  });
});
app.listen(3000);//172.20.10.4
