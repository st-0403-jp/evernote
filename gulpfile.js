/*gulpfile.js*/

var fs = require('fs');
var qs = require('querystring');
var request = require('request');

var gulp = require("gulp");
var clean = require('gulp-clean');
var server = require('gulp-webserver');

var api = require('./api');

gulp.task('serve', function () {
  //api.init();
  gulp.src('manager')
    .pipe(server({
      host: '0.0.0.0',
      port: 8808,
      livereload: true,
      open: false
    }));
  //api.init();
  //api.access();

});

request
  .get('http://0.0.0.0:8808/')
  .on('response', function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var formData = qs.parse(chunk);
      var formArr = [];
      for (var key in formData) {
        if (key === 'name') {
          formArr.push(formData[key]);
        }
      }
      console.log(formArr[0]);
    });
  });

gulp.task('default', function () {
  //api.init();
});
