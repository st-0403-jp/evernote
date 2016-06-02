page.render = (function () {
    var execute = {};

    execute.init = function (viewDir) {
        common.doXhr.request({
            methodType: 'GET',
            path: '../viewData/'+ viewDir +'/note.json',
            contentType: 'application/json',
            callback: function (response) {
                if (viewDir === '1464586504000') {
                    common.hb.insert('#temp-ramen', 'article', response);
                }
                if (viewDir === 'test') {
                    common.hb.insert('#temp-test', 'article', response);
                };
            }
        });
    };

    return execute;
})();

page.top = (function () {
    var execute = {};

    execute.init = function () {
        console.log('top');
        common.hb.insert('#temp-test', 'article', null);
    };

    return execute;
})();
