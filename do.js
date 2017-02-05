/*do.js*/
var path = require('path');
var fs = require('fs');
var async = require('async');

var api = require('./api');

var Evernote = require('evernote').Evernote;
var enml = require('enml-js');

var express = require('express');
var app = express();

function createTmpData (dir, bufData) {
  fs.readdir(__dirname + '/src/tmpData/' + dir, function (err, files) {
    if (!err) {
      // ディレクトリがあったら削除する
      fs.unlinkSync(__dirname + '/src/tmpData/' + dir + '/note.json');
      fs.rmdirSync(__dirname + '/src/tmpData/' + dir);
    }
    fs.mkdirSync(__dirname + '/src/tmpData/' + dir, 0755);

    fs.writeFile(__dirname + '/src/tmpData/' + dir + '/note.json', bufData, function (err) {
      if (err) {throw err;}
    });
  });
}

// view engine setup
app.set('views', /*__dirname*/path.join(__dirname, 'manager'));
app.set('view engine', 'ejs'); // ejsを使う
//app.use(express.static(path.join(__dirname, 'manager/css')));
//console.log(path.join(__dirname, 'manager/css'));

app.get('/', function(req, res) {
  api.init(req, res);
});
app.get('/manager', function (req, res) {
  res.render('index', {noteTitle: 'マネージャー', body: '管理画面'});
  res.send();
  var oauthParam = [];
  var oauthToken, oauth_verifier;
  oauthParam = req.url.split('&');
  oauthParam.forEach(function (data) {
    if (data.indexOf('oauth_token') > -1) {
      oauthToken = data.split('=')[1];
    }
    if (data.indexOf('oauth_verifier') > -1) {
      oauth_verifier = data.split('=')[1];
    }
  });
  api.client.getAccessToken(oauthToken, MY_OAUTH_TOKEN_SECRET, oauth_verifier, function(err, oauthAccessToken, oauthAccessTokenSecret, results) {
    // store 'oauthAccessToken' somewhere
    if (err) {
      console.log(err);
      return;
    }

    var clientAccess = new Evernote.Client({token: oauthAccessToken, sandbox: false});
    
    var noteStore = clientAccess.getNoteStore();
    var userStore = clientAccess.getUserStore();

    var noteFilter = new Evernote.NoteFilter();
    var notesMetadataResultSpec = new Evernote.NotesMetadataResultSpec({
        includeTitle: true
    });
    var username = 'sato252011';
    var pageSize = 100;

    var filterP = new Promise(function (resolve, reject) {
      noteStore.listNotebooks(function (err, notebooks) {
        if (err) {
          console.log(err);
          return;
        }
        // ノート名とidの取得
        async.mapSeries(notebooks, function (notebook, callback) {
          var notebookGuid = notebook.guid;
          var notebookName = notebook.name;
          var filter = new Evernote.NoteFilter();

          var filterNoteBooks = [
          'ラーメン',
          '技術',
          'ブログ-マネジメント',
          'ブログ-その他'
          ];

          // ブログにアップするノートブックを絞り込む
          if (filterNoteBooks.indexOf(notebookName) !== -1) {
            filter.notebookGuid = notebookGuid;
            callback(null, {filter: filter, book: notebookName});
          } else {
            callback(null, null);
          }
        }, function (err, results) {
          if (err) {throw new Error(err);}
          var filterNotes = [];
          async.mapSeries(results, function (filterObj, callback) {
            if (filterObj == null) {
              callback(null, null);
              return;
            }
            // notebookに紐付いたnotesを取得する
            noteStore.findNotesMetadata(oauthAccessToken, filterObj.filter, 0, pageSize, notesMetadataResultSpec, function(err, notesData) {
              filterNotes = filterNotes.concat({data: notesData.notes, book: filterObj.book});
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
      /*
        results = {
          notesData: [
            {
              data: [],
              book: string
            },
            {
              data: [],
              book: string
            }
          ]
        }
      */
      // noteデータの変数
      var noteTitle, noteHtml, noteText, noteUpdate, noteCreated, noteResources, noteObj;
      // noteの保存に使うデータの変数
      var noteBuf, createdListBuf;
      // 保存するnoteData配列
      var saveDatas = [];
      var saveDir;
      async.mapSeries(results.notesData, function (noteData, outsideCallback) {
        var noteDataArr = noteData.data;
        var notebook = noteData.book;
        // noteを取得
        async.mapSeries(noteDataArr, function (note, insideCallback) {
          noteStore.getNote(note.guid, true, true, true, true, function(err, targetNote) {
            if (err) {
              throw new Error(err);
            }
            noteTitle = targetNote.title;
            noteHtml = enml.HTMLOfENML(targetNote.content, targetNote.resources);
            noteText = enml.PlainTextOfENML(targetNote.content, targetNote.resources);
            noteUpdate = targetNote.updated + '';
            noteCreated = targetNote.created + '';
            noteObj = {
              created: noteCreated,
              update: noteUpdate,
              noteTitle: noteTitle,
              noteText: noteHtml,
              notebook: notebook
            };
            if (targetNote.resources) {
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
            insideCallback(null, noteObj);
          });
        }, function (err, results) {
          saveDatas = saveDatas.concat(results);
          outsideCallback(null, null);
        });

      }, function (err, results) {
        console.log(saveDatas);
        // results = [null, null]
        async.mapSeries(saveDatas, function (saveData, callback) {
          saveDir = saveData.update;
          noteBuf = new Buffer(JSON.stringify(saveData, null, ''));
          // evernote更新日付でディレクトリを作る
          createTmpData(saveDir, noteBuf);

          callback(null, saveDir);
        }, function (err, results) {
          // results = [update0, update1, ...]
          // 後々マッピングするためのディレクトリデータ
          fs.writeFileSync(__dirname + '/src/tmpData/updateList.json', new Buffer(JSON.stringify({'updateList': results}, null, '')));
        });
      });
    });
  });
});
app.listen(3000);
