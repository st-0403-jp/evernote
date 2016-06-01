/*gulpfile.js*/

var fs = require('fs');

var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');
var ejs = require('gulp-ejs');

/*
var tmpData = null;
var noteUpdateList = JSON.parse(fs.readFileSync('src/tmpData/noteUpdateList.json', 'utf-8'));
//console.log(noteUpdateList.updateList[0]);
fs.readdir('src/tmpData/', function (err, dirs) {
  if (err) {
    return false;
  }
  //tmpData
  dirs.filter(function (dir) {
    return (fs.statSync('src/tmpData/' + dir).isDirectory() && noteUpdateList.updateList[0] === dir);
  }).forEach(function (jsonDir) {
    var jsonData = JSON.parse(fs.readFileSync('src/tmpData/' + jsonDir + '/note.json', 'utf-8'));
    tmpData = jsonData;
  });
});

gulp.task('view', function () {
  return setTimeout(function () {
    gulp.src('src/tmp/index.ejs')
    .pipe(ejs(tmpData, {ext: '.html'}))
    .pipe(gulp.dest('prod/view'));
  }, 100);
});
*/
gulp.task('viewData', function () {
  gulp.src('src/tmpData/noteUpdateList.json')
  .pipe(gulp.dest('prod/viewData/'));
  var noteUpdateList = JSON.parse(fs.readFileSync('src/tmpData/noteUpdateList.json', 'utf-8'));
  //console.log(noteUpdateList.updateList[0]);
  fs.readdir('src/tmpData/', function (err, dirs) {
    if (err) {
      return false;
    }
    dirs.filter(function (dir) {
      return (fs.statSync('src/tmpData/' + dir).isDirectory() && noteUpdateList.updateList[0] === dir);
    }).forEach(function (jsonDir) {
      gulp.src('src/tmpData/' + jsonDir + '/note.json')
      .pipe(gulp.dest('prod/viewData/' + jsonDir));
    });
  });
});

gulp.task('ejs', function () {
  return gulp.src('src/ejs/*.ejs')
    .pipe(ejs(null, {ext: '.html'}))
    .pipe(gulp.dest('prod'));
});

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
  .pipe(gulp.dest('prod/css'));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(gulp.dest('prod/js'));
});

gulp.task('serve', ['viewData', 'ejs', 'css', 'js'], function () {
  gulp.watch(['src/ejs/*.ejs', 'src/css/*.css', 'src/js/*.js'], ['ejs', 'css', 'js']);
  gulp.src('prod')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: true
    }));
});

gulp.task('prod', ['viewData', 'ejs', 'css', 'js'], function () {
  console.log('prod完了');
});

gulp.task('default', function () {
  setTimeout(function () {
    console.log(tmpData);
  }, 100);
});
