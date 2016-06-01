//1464586504000
window.onload = function () {
    console.info('load!');

    location.hash = location.hash || '#!test';

    var hash = location.hash.replace('#!', '');

    page.render.init(hash);

    window.onhashchange = function () {
        hash = location.hash.replace('#!', '');
        page[hash].init();
    };
};
