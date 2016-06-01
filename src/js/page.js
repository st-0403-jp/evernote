page.render = (function () {
    var execute = {};

    execute.init = function (viewDir) {
        common.doXhr.request({
            methodType: 'GET',
            path: '../viewData/'+ viewDir +'/note.json',
            contentType: 'application/json',
            callback: function (response) {
                common.hb.insert('#temp-ramen', 'article', response);
            }
        });
    };

    return execute;
})();

page.top = (function () {
    var execute = {};

    execute.init = function () {
        console.log('top');
        common.hb.insert('#temp-top', 'article', null);
    };

    return execute;
})();
