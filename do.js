/*do.js*/
var api = require('./api');
var util = require('./util');
var express = require('express');
var app = express();

// view engine setup
app.set('views', __dirname/*path.join(__dirname, 'views')*/);
app.set('view engine', 'ejs'); //ejsを変える

app.get('/', function(req, res){
  api.init(req, res);
  //res.render('index', { title: 'EvernoteAPI' });
  //res.send('hello world');
});

app.listen(3000);
