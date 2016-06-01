var common = {};
var page = {};

var $ = function (elmName) {
  var elm = document.querySelectorAll(elmName);
  if (elm.length === 1) {
    elm = document.querySelector(elmName);
  }
  return elm;
};

/*
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {

    switch(xhr.readyState) {
      case 1:
        console.log("open() メソッドの呼び出しが完了した");
        break;

      case 2:
        console.log("レスポンスヘッダの受信が完了した");
        break;

      case 3:
        console.log("レスポンスボディを受信中（繰り返し実行される）");
        break;

      case 4:
        //console.log(xhr.getAllResponseHeaders());
        console.log(xhr.responseText);
        var res = xhr.responseText;
        console.log("XHR 通信が完了した（成功失敗に関わらず）");
        setTimeout(function () {
          $('.profile_box').innerHTML = res;
          $('.profile_box').style.opacity = 1.0;
        }, 1500);
        break;
      };
};

var httpRequest = function (type, pass, content) {
    xhr.open(type, pass, false);
    xhr.setRequestHeader('Content-Type' , content);
    xhr.send();
    xhr.abort();
};
*/
