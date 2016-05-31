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
  // tmpData
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

gulp.task('ejs', function () {
  setTimeout(function () {
    gulp.src('src/ejs/index.ejs')
    .pipe(ejs(tmpData/*{title: 'ラーメン', html: '<p>テスト</p>'}*/, {ext: '.html'}))
    .pipe(gulp.dest('prod/view'));
  }, 100);
});

gulp.task('build', function () {
});

gulp.task('default', function () {
});
