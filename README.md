#EvernoteAPIでブログ記事を生成

Evernoteでメモを取っていたので**（主にラーメンデータ）**、
そのデータを使えばより簡単に共有できるかと思いました。
かつこれから足していっても大丈夫。

<img src="src/img/ramen-inoco-tiny.jpg" height="" width="80%">

##仕様

Evernoteのノートデータを取得し、そのデータをブログサイトで表示する。

##挙動

###Evernote開発用アカウントにOAuth認証
* Evernote Devloperサイトで開発用アカウントを作り、consumerKeyを取得

```
var client = new Evernote.Client({
  consumerKey: 'sato252011-7373',//'sato252011-7217',
  consumerSecret: 'a59a91f11f6b3d5e',//'52dba2f462408a5d',
  sandbox: true // Optional (default: true)
});
```
* Evernoteと連携する

```
method.init = function (req, res) {
    client.getRequestToken(/*'http://192.168.179.2:3000/manager/'*/'http://10.17.208.153:3000/manager/', function(err, oauthToken, oauthTokenSecret, results) {
      // store tokens in the session
      if (err) {
        console.log(err);
        return false;
      }
      //evernoteと連携する
      res.redirect(client.getAuthorizeUrl(oauthToken));
    });
};
```
###アクセストークンをもらってデータを取得
* 認証したら、API取得用のサーバーに戻ってくる
* コールバックURLにアクセストークンを取得するクエリがもらえる

```
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
```
* OAuthトークンとそのクエリを使ってアクセストークンをGetできる

```
var clientAccess = new Evernote.Client({token: oauthAccessToken});
    
var noteStore = clientAccess.getNoteStore();
var noteFilter = new Evernote.NoteFilter();
var notesMetadataResultSpec = new Evernote.NotesMetadataResultSpec({
    includeTitle: true
});
var pageSize = 10;
```

###APIアクセスサーバーでjson形式で保存
* アクセストークンを使うとノートデータを取得できる

```
noteStore.findNotesMetadata(oauthAccessToken, noteFilter, 0, pageSize, notesMetadataResultSpec, function(err, notesData) {
if (err) {
    console.log(err);
    return false;
}
noteStore.getNote(notesData.notes[1].guid, true, true, true, true, function(err, note) {
    //console.log(err || note);
    var toDate = new Date().getTime();
    var noteTitle = note.title/*notesData.notes[1].title*/;
    var noteHtml = enml.HTMLOfENML(note.content, note.resources);
    var noteText = enml.PlainTextOfENML(note.content, note.resources);
    var noteUpdate = note.updated + '';
    var noteCreated = note.created + '';
```
* json形式で保存

```
//tmpDataフォルダにdata.json作る
fs.readdir(__dirname + '/src/tmpData', function (err, files) {
  if (err) {
    console.log(err);
    fs.mkdirSync(__dirname + '/src/tmpData', 0755);
  }
  //evernote更新日付でディレクトリを作る
  fs.readdir(__dirname + '/src/tmpData/' + noteCreated, function (err, files) {
    if (err) {
        console.log(err);
        fs.mkdirSync(__dirname + '/src/tmpData/' + noteCreated, 0755);
    }
    var noteBuf = new Buffer(JSON.stringify({object: [{created: noteCreated, update: noteUpdate, noteTitle: noteTitle, noteText: noteText}]}, null, ''));
    var createdListBuf = new Buffer(JSON.stringify({'createdList': [noteCreated]}, null, ''));
    fs.writeFile(__dirname + '/src/tmpData/' + noteCreated + '/note.json', noteBuf, function (err) {
      if (err) {throw err;}
    });
    fs.writeFile(__dirname + '/src/tmpData/createdList.json', createdListBuf, function (err) {
      if (err) {throw err;}
    });
  });
});
```

###gulpタスクでビルドファイルを生成
* src内ファイルからビルドファイルを生成
gulpfile.js
