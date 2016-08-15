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
});
app.get('/manager', function (req, res) {
  res.render('index', {noteTitle: 'マネージャー', body: '管理画面'});
  res.send();
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
    var userStore = clientAccess.getUserStore();
    var noteFilter = new Evernote.NoteFilter();
    var notesMetadataResultSpec = new Evernote.NotesMetadataResultSpec({
        includeTitle: true
    });
    var username = 'sato252011';
    var pageSize = 100;

    var filterP = new Promise(function (resolve, reject) {
      noteStore.listNotebooks(oauthAccessToken, function (err, notebooks) {
        if (err) {
          console.log(err);
          return;
        }
        // ノート名とidの取得
        async.mapSeries(notebooks, function (notebook, callback) {
          var notebookGuid = notebook.guid;
          var notebookName = notebook.name;

          // ブログにアップするノートブックを絞り込む
          if (notebookName === 'ラーメン' || notebookName === '技術') {
            var filter = new Evernote.NoteFilter();
            filter.notebookGuid = notebookGuid;
            callback(null, filter);
          } else {
            callback(null, null);
          }
        }, function (err, results) {
          if (err) {throw new Error(err);}
          var filters = results;
          var filterNotes = [];
          async.mapSeries(filters, function (filter, callback) {
            if (filter == null) {
              callback(null, null);
              return;
            }
            noteStore.findNotesMetadata(oauthAccessToken, filter, 0, pageSize, notesMetadataResultSpec, function(err, notesData) {
              filterNotes = filterNotes.concat(notesData.notes);
              callback(null, notesData);
            });
          }, function (err, results) {
            // noteDataを返す
            resolve({notesData: filterNotes, notebookAll: results});
          });
        });
      });
      return this;
    });
    filterP.then(function (results) {
      //noteデータの変数
      var noteTitle, noteHtml, noteText, noteUpdate, noteCreated, noteResources;
      //noteの保存に使うデータの変数
      var noteBuf, createdListBuf;
      // noteを一つの配列にする
      var notesData = [];
      async.mapSeries(results.notesData, function (noteData, callback) {
        // noteを取得
        noteStore.getNote(noteData.guid, true, true, true, true, function(err, note) {
          if (err) {
            throw new Error(err);
          }
          noteTitle = note.title;
          noteHtml = enml.HTMLOfENML(note.content, note.resources);
          noteText = enml.PlainTextOfENML(note.content, note.resources);
          noteUpdate = note.updated + '';
          noteCreated = note.created + '';
          noteBuf = new Buffer(JSON.stringify({created: noteCreated, update: noteUpdate, noteTitle: noteTitle, noteText: noteHtml}, null, ''));
          noteResources = note.resources;

          if (note.resources) {
            /*
            var resourceGuid = note.resources.guid;
            userStore.getPublicUserInfo(username, function(err, userInfo) {
              var imgUrl = userInfo.webApiUrlPrefix + "res/" + resourceGuid;
            });
            */
            /*
            noteStore.getResource(resourceGuid, true, false, true, false, function(err, resource) {
              //console.log(resource);
              var fileContent = resource.data.body;
              var fileType = resource.mime;
              var fileName = resource.attributes.sourceURL;
              console.log(fileName);
            });
            */
          }

          // evernote更新日付でディレクトリを作る
          fs.readdir(__dirname + '/src/tmpData/' + noteUpdate, function (err, files) {
            if (!err) {
              // ディレクトリがあったら削除する
              fs.unlinkSync(__dirname + '/src/tmpData/' + noteUpdate + '/note.json');
              fs.rmdirSync(__dirname + '/src/tmpData/' + noteUpdate);
            }
            fs.mkdirSync(__dirname + '/src/tmpData/' + noteUpdate, 0755);

            fs.writeFile(__dirname + '/src/tmpData/' + noteUpdate + '/note.json', noteBuf, function (err) {
              if (err) {throw err;}
            });
          });

          callback(null, {update: noteUpdate, resources: noteResources});

        });

      }, function (err, results) {
        async.mapSeries(results, function (noteResult, callback) {
          var noteUpdate = noteResult.update;
          var resources = noteResult.resources;
          resources.forEach(function (resource) {
            var jsonData = JSON.parse(fs.readFileSync(__dirname + '/src/tmpData/' + noteUpdate + '/note.json', 'utf-8'));
          });
          callback(null, noteResult.update);
        }, function (err, results) {
          // 後々マッピングするためのディレクトリデータ
          fs.writeFileSync(__dirname + '/src/tmpData/updateList.json', new Buffer(JSON.stringify({'updateList': results}, null, '')));
        });
      });
    });
    /*
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
          //console.log(note);

          //evernote更新日付でディレクトリを作る
          fs.readdir(__dirname + '/src/tmpData/' + noteCreated, function (err, files) {
            if (!err) {
              // ディレクトリがあったら削除する
              fs.unlinkSync(__dirname + '/src/tmpData/' + noteCreated + '/note.json');
              fs.rmdirSync(__dirname + '/src/tmpData/' + noteCreated);
            }
            fs.mkdirSync(__dirname + '/src/tmpData/' + noteCreated, 0755);

            noteBuf = new Buffer(JSON.stringify({created: noteCreated, update: noteUpdate, noteTitle: noteTitle, noteText: noteText}, null, ''));

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
    });
    */
  });
});
app.listen(3000);
