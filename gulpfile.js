/*gulpfile.js*/

var fs = require('fs');

var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');

var api = require('./api');

gulp.task('serve', function () {
  //api.init();
  gulp.src('model')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: true
    }));
  //api.init();
});

gulp.task('default', ['serve'], function () {
  api.init();
});
