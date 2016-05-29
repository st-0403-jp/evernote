/*manager.js*/
var path = require('path');

var api = require('./api');
var util = require('./util');
var express = require('express');
var app = express();

// view engine setup
app.set('views', /*__dirname*/path.join(__dirname, 'manager'));
app.set('view engine', 'ejs'); //ejsを変える

app.get('./manager/', function(req, res) {
  //api.init(req, res);
  res.render('index', { title: 'EvernoteAPI' });
  res.send();
  //console.log(1);
});
app.listen(8000);//172.20.10.4
