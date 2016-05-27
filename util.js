/*util.js*/

module.exports = (function () {
  var method = {};

  method.isEqual = function (key, val) {
    if (key === val) {
      return true;
    } else {
      return false;
    }
  };

  method.isEmpty = function (val) {
    if (val === null || val === undefined) {
      return true;
    } else {
      return false;
    }
  };

  return method;

})();