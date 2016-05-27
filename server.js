/*server.js*/

var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var params = require('./params');
var api = require('./api');

var server = http.createServer();

var fpath = process.argv[2];
console.log(fpath);
if (!fpath) {
  console.log('fpath none error');
  process.exit();
}

server.on('request', function(req, res) {

  //formデータを取得
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    var formData = qs.parse(chunk);
    var formArr = [];
    for (var key in formData) {
      if (key === 'name') {
        formArr.push(formData[key]);
      }
    }
    //chatworkにリクエスト
    api.req({
      apiName: formArr[0]
    });
    console.log(formArr[0]);
  });
  
  var readFileFunk = function (filepath, type) {
    fs.readFile(__dirname + filepath, '', function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': type});
        res.write('error!!!');
        return res.end();
      }
      res.writeHead(200, {'Content-Type': type});
      res.write(data);
      res.end();
    });
  };

  //リクエスト処理
  var reqPath = req.url;
  console.log(reqPath);
  if (reqPath === '/') {
    reqPath = reqPath + 'index.html';
  } else if (reqPath.indexOf('?') > 0) {
    reqPath = reqPath.slice(0, reqPath.indexOf('?'));
  }
  var reqPathExt = path.extname(reqPath);
  console.log(reqPathExt);

  var fileType = '';
  var fileFlg = '';
  if (reqPathExt === '.html') {
    fileType = 'text/html';
    fileFlg = 'text';
  } else if (reqPathExt === '.css') {
    fileType = 'text/css';
    fileFlg = 'text';
  } else if (reqPathExt === '.js') {
    fileType = 'text/javascript';
    fileFlg = 'text';
  } else if (reqPathExt === '.png') {
    fileType = 'image/png';
    fileFlg = 'data';
  } else if (reqPathExt === '.jpg') {
    fileType = 'image/jpg';
    fileFlg = 'data';
  } else if (reqPathExt === '.json') {
    fileType = 'application/json';
    fileFlg = 'data';
  }
  readFileFunk(reqPath, fileType);
  /*
  if (fileFlg === 'text') {
    readFileFunkUtf(reqPath, fileType);
  } else if (fileFlg === 'data') {
    readFileFunkImage(reqPath, fileType);
  }
  */

}).listen(params.ip.port, params.ip.host);
console.log(params.ip);
console.log('server listening...');
