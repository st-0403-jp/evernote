/*gulpfile.js*/

var fs = require('fs');
var regExp = function (string, option) {
  return new RegExp(string, option);
};
var async = require('async');
var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');
var ejs = require('gulp-ejs');
var pleeease = require('gulp-pleeease');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var command = process.argv[2];

/**
 * buildかどうかチェックする
 */
var buildCheck = function () {
  if (command == null) {
    return command;
  }
  if (command === 'prod') {
      return true;
  } else {
      return false;
  }
};

/**
 * パス
 */
var pass = (buildCheck()) ? {
  top: 'prod',
  view: 'prod/viewData',
  css: 'prod/css',
  js: 'prod/js',
  img: 'prod/img',
  lib: 'prod/lib',
  fonts: 'prod/fonts'
} : {
  top: 'mock',
  view: 'mock/viewData',
  css: 'mock/css',
  js: 'mock/js',
  img: 'mock/img',
  lib: 'mock/lib',
  fonts: 'mock/fonts'
}

/**
 * meta
 */
var metaData = {
  keyword: '',
  description: 'Webで豊かな生活を送ろうをテーマに、フロントエンドエンジニアのとしての技術を記事を残そうと思っております。Webサーバやアプリ事情など関連技術、大好きラーメン情報なども載せていきます。'
};

/**
 * news
 */
var newsData = {
  dl: [
    {
      dt: '2016.12.02',
      dd: 'あああああああ機能追加あああああああ機能追加'
    },
    {
      dt: '2016.12.01',
      dd: 'テストテスト'
    },
    {
      dt: '2016.11.15',
      dd: 'テストテストテスト'
    }
  ]
};

/**
 * 必要データを生成
 */
var createTmpData = function () {
  return new Promise(function (resolve) {
    var tmpData = [];
    fs.readdir('src/tmpData', function (err, dirs) {
      if (err) {
        return false;
      }
      // tmpData
      async.mapSeries(dirs, function (dir, callback) {
        if (!fs.statSync('src/tmpData/' + dir).isDirectory()) {
          callback(null, '');
          return;
        }
        var jsonData = JSON.parse(fs.readFileSync('src/tmpData/' + dir + '/note.json', 'utf-8'));
        callback(null, jsonData);
      }, function (err, jsonDatas) {
        jsonDatas.filter(function (data) {
          return data;
        }).sort(function (a, b) {
          return b.update - a.update;
        }).forEach(function (jsonData) {
          tmpData.push(jsonData);
        });
        resolve(tmpData);
      });
    });
  });
};
var createTmpDataList = function () {
  return new Promise(function (resolve) {
    var tmpDataList = JSON.parse(fs.readFileSync('src/tmpData/updateList.json', 'utf-8'));
    tmpDataList.updateList.sort(function (a, b) {
      return b - a;
    });
    resolve(tmpDataList);
  });
};

/**
 * evernoteで生成されてしまうhtml, head, bodyを削除, 改行コードはbrタグへ
 */
var replaceHTML = function (htmlString) {
  var result = htmlString;
  result = result.replace( /\\n/g, '<br>');
  result = result.replace( /<html>/g, '');
  result = result.replace( /<\/html>/g, '');
  result = result.replace( /<head>/g, '');
  result = result.replace( /<\/head>/g, '');
  result = result.replace( /<meta http-equiv="Content-Type" content="text\/html; charset=UTF-8"\/>/g, '');
  result = result.replace( /<body style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">/, '');
  result = result.replace( /<\/body>/g, '');
  // font-familyにダブルクオートが入るとstyleが効かなくなるのでシングルに置き換える
  result = result.replace(/\&quot\;/g, '\'');
  var result2 = result.match(/font-family\:\s.+?\;/g);
  if (result2) { result2 = result2.join('').replace(/\"/g, '\''); }
  result = result.replace(/font-family\:\s.+?\;/g, result2);
  return result;
};

/**
 * gulp.task
 */
gulp.task('clean', function () {
  if (buildCheck()) {
    gulp.src('prod/*').pipe(clean());
  } else {
    gulp.src('mock/*').pipe(clean());
  }
});

gulp.task('ejs', function () {
  return createTmpDataList().then(function (tmpDataList) {
    createTmpData().then(function (tmpData) {
      tmpDataList.updateList.filter(function (update) {
        return (fs.statSync('src/tmpData/' + update).isDirectory());
      }).forEach(function (dir, index, dirs) {
        var beforeDir, afterDir;
        // いらないタグを削除する
        tmpData[index].noteText = replaceHTML(tmpData[index].noteText);
        if (index !== 0) {
           beforeDir = dirs[index - 1];
        }
        if (index !== dirs.length - 1) {
          afterDir = dirs[index + 1];
        }
        gulp.src('src/ejs/view/index.ejs')
          .pipe(ejs({
            page: 'detail',
            article: tmpData[index],
            directory: dir,
            beforeDir: beforeDir,
            afterDir: afterDir,
            meta: metaData,
            news: newsData
          }, {ext: '.html'}))
          .pipe(gulp.dest(pass.view + '/' + dir + '/'));
      });
      gulp.src('src/ejs/index.ejs')
        .pipe(ejs({
          page: 'top',
          article: tmpData,
          meta: metaData,
          news: newsData
        }, {ext: '.html'}))
        .pipe(gulp.dest(pass.top));
      });
  });
});

gulp.task('img', function () {
  return gulp.src(['src/img/*', 'src/img/*.png'])
    .pipe(gulp.dest(pass.img));
});

gulp.task('css', function () {
  if (buildCheck()) {
    return gulp.src('src/css/*.css')
      .pipe(pleeease())
      .pipe(gulp.dest('prod/css'));
  } else {
    return gulp.src('src/css/*.css')
      .pipe(gulp.dest('mock/css'));
  }
});

gulp.task('js', function () {
  if (buildCheck()) {
    return gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('prod/js'));
  } else {
    return gulp.src('src/js/*.js')
      .pipe(gulp.dest('mock/js'));
  }
});

gulp.task('lib', function () {
  if (buildCheck()) {
    return gulp.src(['src/css/lib/*.css'])
      .pipe(pleeease())
      .pipe(gulp.dest('prod/lib'));
  } else {
    return gulp.src(['src/css/lib/*.css'])
      .pipe(gulp.dest('mock/lib'));
  }
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/*')
      .pipe(gulp.dest(pass.fonts));
});

gulp.task('mockServe', function () {
  // globで書き直し
  gulp.watch(['src/ejs/*.ejs', 'src/ejs/includes/common/*.ejs', 'src/ejs/includes/tmp/*.ejs', 'src/ejs/view/*.ejs'], ['ejs']);
  gulp.watch(['src/css/*.css'], ['css']);
  gulp.watch(['src/js/*.js'], ['js']);
  gulp.src('mock')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: true
    }));
});

gulp.task('prodServe', function () {
  gulp.src('prod')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: true
    }));
});

gulp.task('mock', ['ejs', 'css', 'js', 'img', 'lib', 'fonts'], function () {
  console.log('mock compleate');
});

gulp.task('prod', ['ejs', 'css', 'js', 'img', 'lib', 'fonts'], function () {
  console.log('build compleate');
});


gulp.task('dataClean', function () {
  gulp.src('src/tmpData/*').pipe(clean());
});

gulp.task('test', function () {
  console.log(command);
});

gulp.task('default', function () {
  setTimeout(function () {
    console.log(metaData);
  }, 100);
});
