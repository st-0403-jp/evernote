page.test = (function () {
    var execute = {};

    execute.init = function () {
        common.doXhr.request('GET', '../viewData/1464586592000/note.json', 'application/json');
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
