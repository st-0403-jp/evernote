/*gulpfile.js*/

var fs = require('fs');
var regExp = function (string, option) {
  return new RegExp(string, option);
};
var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');
var ejs = require('gulp-ejs');

/**
 * 必要データを生成
 */
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

var replaceHTML = function (htmlString) {
  var result = htmlString;
  //console.log(htmlString);
  result = result.replace( /<html>/g, '');
  result = result.replace( /<\/html>/g, '');
  result = result.replace( /<head>/g, '');
  result = result.replace( /<\/head>/g, '');
  result = result.replace( /(<meta)(.*)("|¥b)(\/>)/, '');
  result = result.replace( /^(<body)(.*)(>)/, '');
  result = result.replace( /<\/body>/g, '');
  console.log(result);
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
    tmpDataList.createdList.filter(function (createdDate) {
      return (fs.statSync('src/tmpData/' + createdDate).isDirectory());
    }).forEach(function (dir, index) {
      var targetText = tmpData[index].noteText;
      var expText = regExp('\n', 'g');
      var brText = targetText.replace(expText,'<br>');
      var target = replaceHTML(brText);
      gulp.src('src/ejs/view/index.ejs').pipe(ejs({data: {title: tmpData[index].noteTitle, text: target}}, {ext: '.html'})).pipe(gulp.dest('prod/viewData/' + dir));
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

gulp.task('dataClean', function () {
  gulp.src('src/tmpData/*').pipe(clean());
});

gulp.task('default', function () {
  setTimeout(function () {
    console.log(tmpData);
  }, 100);
});
