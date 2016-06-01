$ = function (elmName) {
  var elm = document.querySelectorAll(elmName);
  if (elm.length === 1) {
    elm = document.querySelector(elmName);
  }
  return elm;
};

var xhr = new XMLHttpRequest();
