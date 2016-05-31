/*gulpfile.js*/

var fs = require('fs');

var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');
var ejs = require('gulp-ejs');

var tmpData;
fs.readdir('src/tmpData/', function (err, files) {
  if (err) {
    return false;
  }
  //tmpData
  files.filter(function (json) {
    return (fs.statSync('src/tmpData/' + json).isFile());
  }).forEach(function (jsonFile) {
    var jsonData = JSON.parse(fs.readFileSync('src/tmpData/' + jsonFile, 'utf-8'));
    tmpData = jsonData;
  });
});


gulp.task('serve', function () {
  gulp.src('prod')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: false
    }));
});

gulp.task('view', function () {
  return setTimeout(function () {
    gulp.src('src/tmp/index.ejs')
    .pipe(ejs(tmpData, {ext: '.html'}))
    .pipe(gulp.dest('prod/view'));
  }, 100);
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

gulp.task('prod', ['ejs', 'view', 'css', 'js'], function () {
  console.log('prod完了')
});

gulp.task('default', function () {
});
