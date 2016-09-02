var common = {};
var page = {};

var $ = function (elmName) {
  var elm = document.querySelectorAll(elmName);
  if (elm.length === 1) {
    elm = document.querySelector(elmName);
  }
  return elm;
};

(function () {
    common.top = function () {
        var dd = $('.top-article dd');
        Array.prototype.forEach.call(dd, function (ele) {
          var firstDiv = ele.firstElementChild.innerHTML;
          ele.innerHTML = firstDiv;
        });
    };

    common.detail = function () {
        console.log('detail');
    };
})();