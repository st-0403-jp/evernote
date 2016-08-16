var dd = $('.top-article dd');
Array.prototype.forEach.call(dd, function (ele) {
  var firstDiv = ele.firstElementChild.innerHTML;
  ele.innerHTML = firstDiv;
});
