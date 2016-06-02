var common = {};
var page = {};

var $ = function (elmName) {
  var elm = document.querySelectorAll(elmName);
  if (elm.length === 1) {
    elm = document.querySelector(elmName);
  }
  return elm;
};
