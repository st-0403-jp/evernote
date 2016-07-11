common.doXhr = (function () {
    var method = {};

    /*
     * requestData
     * @{ methodType: , path: , contentType: , callback: , }
     */
    method.request = function (requestData) {
        var xhr = new XMLHttpRequest();
        var methodType = requestData.methodType;
        var path = requestData.path;
        var contentType = requestData.contentType;
        var callback = requestData.callback;

        xhr.onreadystatechange = function () {

            switch(xhr.readyState) {
              case 1:
                console.log("open()の呼び出しが完了");
                break;

              case 2:
                console.log("レスポンスヘッダの受信が完了");
                break;

              case 3:
                console.log("レスポンスボディを受信中（繰り返し実行される）");
                break;

              case 4:
                //console.log(xhr.getAllResponseHeaders());
                return new Promise(function (resolve, reject) {

                    if (xhr.status === 0) {
                        console.error('通信失敗');
                        reject(xhr.status);
                    } else {
                        var res = xhr.responseText;
                        if (res.indexOf('Cannot') === -1) {
                            console.info("通信成功");
                            resolve(res);
                        } else {
                            console.error('通信失敗');
                            reject(res);
                        }
                    }
                }).then(function (results) {
                    if (callback && typeof callback === 'function') {
                        callback(results);
                    } else {
                        console.error(callback);
                    }
                }, function (results) {
                    console.error(results);
                });
                break;
              }
        };
        xhr.open(methodType, path, true);
        xhr.setRequestHeader('Content-Type' , contentType);
        xhr.send();
        /*
        var test = $('.test');
        console.log(test);
        */
    };

    return method;
})();
