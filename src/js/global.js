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
        console.log('top');
    };

    common.detail = function () {
        console.log('detail');
    };
})();
