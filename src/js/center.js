
window.onload = function () {
    console.info('load!');

    location.hash = location.hash || '#!test';

    var hash = location.hash.replace('#!', '');

    page[hash].init();

    window.onhashchange = function () {
        hash = location.hash.replace('#!', '');
        page[hash].init();
    };
};
