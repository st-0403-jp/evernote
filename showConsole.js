/*showConsole.js*/

module.exports = (function () {
  var method = {};

  method.key = null;

  method.val = null;

  //値の初期化
  method.init = function (data) {
    this.key = data.key;
    this.val = data.val;
  };

  /*
   * key: val
   */
  method.k2v = function (data) {
    this.init(data);    

    console.log(this.key + ': ');
    console.log(this.val);
    console.log('\n');
  };

  /*
   * key:
   * val
   *
   * key:
   * val
   *
   * key:
   * val
   * 
   * ... 
   */
  method.each = function (data) {
    this.init(data);
    that = this;

    that.val.forEach(function (ele, index, array) {
      console.log(that.key + '[' + index + ']: ');
      console.log(ele);
      console.log('\n');
    });
  };

  return method;
})();