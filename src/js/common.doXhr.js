common.doXhr = (function () {
    var method = {};

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
            var res = xhr.responseText;
            console.log("XHR 通信が完了した（成功失敗に関わらず）");
            /*
            var p = new Promise(function (resolve, reject) {
                console.log('promise');
                return resolve('resolve');
            });
            p.then(function (e) {
                console.log(e);
            });
            */
            common.hb.insert('#temp-ramen', 'article', res);
            break;
          }
    };

    method.request = function (type, pass, content) {
        xhr.open(type, pass, false);
        xhr.setRequestHeader('Content-Type' , content);
        xhr.send();
        xhr.abort();
    };

    return method;
})();