/*gulpfile.js*/

var fs = require('fs');

var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');
var ejs = require('gulp-ejs');

var tmpData = [];
var tmpDataList = JSON.parse(fs.readFileSync('src/tmpData/createdList.json', 'utf-8'));
fs.readdir('src/tmpData', function (err, dirs) {
  if (err) {
    return false;
  }
  //tmpData
  dirs.filter(function (dir) {
    return (fs.statSync('src/tmpData/' + dir).isDirectory());
  }).forEach(function (jsonDir) {
    tmpData.push(JSON.parse(fs.readFileSync('src/tmpData/' + jsonDir + '/note.json', 'utf-8')));
  });
});

gulp.task('clean', function () {
  gulp.src('prod/viewData/*').pipe(clean());
});

gulp.task('ejs', ['clean'], function () {
  return setTimeout(function () {
    tmpDataList.createdList.filter(function (createdDate) {
      return (fs.statSync('src/tmpData/' + createdDate).isDirectory());
    }).forEach(function (dir, index) {
      gulp.src('src/ejs/view/index.ejs').pipe(ejs({data: {title: tmpData[index].noteTitle, text: tmpData[index].noteText}}, {ext: '.html'})).pipe(gulp.dest('prod/viewData/' + dir));
    });
    gulp.src('src/ejs/index.ejs').pipe(ejs({data: tmpData}, {ext: '.html'})).pipe(gulp.dest('prod'));
  }, 100);
});

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
  .pipe(gulp.dest('prod/css'));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(gulp.dest('prod/js'));
});

gulp.task('serve', ['ejs', 'css', 'js'], function () {
  gulp.watch(['src/ejs/*.ejs', 'src/css/*.css', 'src/js/*.js'], ['ejs', 'css', 'js']);
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

gulp.task('default', function () {
  setTimeout(function () {
    console.log(tmpData);
  }, 100);
});
