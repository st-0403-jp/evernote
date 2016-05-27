/*render.js*/

common.render = (function () {
  var method = {};

  method.getData = function () {
    var count = 0;
    var get = setInterval(function(){
      $.ajax({
        url: '/api/data.json',
        type: 'GET',
        dataType: 'json'
      }).done(function (d) {
        console.log(d);
        clearInterval(get);
      }).fail(function (err) {
        console.log(err);
        count++;
        if (count > 10) {
          clearInterval(get);
        } else {
          console.log(count);
        }
      });
    }, 100);
  };

  return method;
})();