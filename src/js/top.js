var div = $('.top-article dd div');

var dd = $('.top-article dd');
Array.prototype.forEach.call(dd, function (ele) {
  div = ele.firstElementChild;
  var targetDiv = div.firstElementChild.innerHTML;
  var targetImg = div.children;
  console.log(targetImg);
  //ele.innerHTML = targetDiv;
});
