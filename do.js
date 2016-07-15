/*do.js*/
var path = require('path');
var fs = require('fs');
var async = require('async');

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
  api.client.getAccessToken(oauthToken, oauthTokenSecret, oauth_verifier, function(err, oauthAccessToken, oauthAccessTokenSecret, results) {
    // store 'oauthAccessToken' somewhere
    if (err) {
      console.log(err);
      return false;
    }
    
    var clientAccess = new Evernote.Client({token: oauthAccessToken});
    
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
        //noteデータの変数
        var noteTitle, noteHtml, noteText, noteUpdate, noteCreated;
        //noteの保存に使うデータの変数
        var noteBuf, createdListBuf;

        async.mapSeries(notesData.notes, function (noteData, next) {
          noteStore.getNote(noteData.guid, true, true, true, true, function(err, note) {
            //console.log(err || note);
            noteTitle = note.title;
            noteHtml = enml.HTMLOfENML(note.content, note.resources);
            noteText = enml.PlainTextOfENML(note.content, note.resources);
            noteUpdate = note.updated + '';
            noteCreated = note.created + '';
            console.log(note);

            //evernote更新日付でディレクトリを作る
            fs.readdir(__dirname + '/src/tmpData/' + noteCreated, function (err, files) {
              if (!err) {
                // ディレクトリがあったら削除する
                fs.unlinkSync(__dirname + '/src/tmpData/' + noteCreated + '/note.json');
                fs.rmdirSync(__dirname + '/src/tmpData/' + noteCreated);
              }
              fs.mkdirSync(__dirname + '/src/tmpData/' + noteCreated, 0755);

              noteBuf = new Buffer(JSON.stringify({today: '2016/07/15', created: noteCreated, update: noteUpdate, noteTitle: noteTitle, noteText: noteText}, null, ''));

              fs.writeFile(__dirname + '/src/tmpData/' + noteCreated + '/note.json', noteBuf, function (err) {
                if (err) {throw err;}
                next(null, noteCreated);
              });
            });
          });
        }, function (err, results) {
          if (err) {throw err;}
          // 後々マッピングするためのディレクトリデータ
            fs.writeFileSync(__dirname + '/src/tmpData/createdList.json', new Buffer(JSON.stringify({'createdList': results}, null, '')));
        });
        res.render('index', {noteTitle: 'マネージャー', body: '管理画面'});
        res.send();
    });
  });
});
app.listen(3000);//172.20.10.4
