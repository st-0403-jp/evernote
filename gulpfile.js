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

/**
 * 必要データを生成
 */
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
  });
});
var tmpDataList = JSON.parse(fs.readFileSync('src/tmpData/updateList.json', 'utf-8'));
tmpDataList.updateList.sort(function (a, b) {
  return b - a;
});
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
  gulp.src('prod/viewData/*').pipe(clean());
});

gulp.task('ejs', ['clean'], function () {
  return setTimeout(function () {
    tmpDataList.updateList.filter(function (update) {
      return (fs.statSync('src/tmpData/' + update).isDirectory());
    }).forEach(function (dir, index) {
      // いらないタグを削除する
      tmpData[index].noteText = replaceHTML(tmpData[index].noteText);
      gulp.src('src/ejs/view/index.ejs').pipe(ejs({data: tmpData[index], directory: dir}, {ext: '.html'})).pipe(gulp.dest('prod/viewData/' + dir + '/'));
    });
    gulp.src('src/ejs/index.ejs').pipe(ejs({data: tmpData}, {ext: '.html'})).pipe(gulp.dest('prod'));
  }, 1000);
});

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
  .pipe(gulp.dest('prod/css'));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(gulp.dest('prod/js'));
});

gulp.task('serve', function () {
  gulp.watch(['src/ejs/*.ejs', 'src/ejs/includes/common/*.ejs', 'src/ejs/includes/tmp/*.ejs', 'src/ejs/view/*.ejs', 'src/css/*.css', 'src/js/*.js'], ['prod']);
  gulp.src('prod')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: true
    }));
});

gulp.task('prod', ['ejs', 'css', 'js'], function () {
  console.log('prod完了');
});

gulp.task('dataClean', function () {
  gulp.src('src/tmpData/*').pipe(clean());
});

gulp.task('default', function () {
  setTimeout(function () {
    console.log(tmpData);
  }, 100);
});
