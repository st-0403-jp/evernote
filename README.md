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
###アクセストークンをもらってデータを取得
###APIアクセスサーバーでjson形式で保存
###gulpタスクでビルドファイルを生成
