common.hb = (function () {
    var method = {};

    method.insert = function (tmpName, targetElmName, data) {
        data = JSON.parse(data);
        var source = $(tmpName).innerHTML;
        var template = Handlebars.compile(source);
        var html = template(data || {error: '404'});
        $(targetElmName).innerHTML = html;
    };

    return method;
})();