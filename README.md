#EvernoteAPIでブログ記事を生成

Evernoteでメモを取っていたので**（主にラーメンデータ）**、
そのデータを使えばより簡単に共有できるかと思いました。
かつこれから足していっても大丈夫。

<img src="src/img/ramen-inoco-tiny.jpg" height="" width="80%">

##仕様

Evernoteのノートデータを取得し、そのデータをブログサイトで表示する。

##挙動

* Evernote開発用アカウントにOAuth認証
* アクセストークンをもらってデータを取得
* APIアクセスサーバーでjson形式で保存
* gulpタスクでビルドファイルを生成
