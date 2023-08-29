var uri = require('url');

function memoizeLastCall(func) {
  var lastArg1 = -1;
  var lastArg2 = -1;
  var lastResult = null;
  return function() {
    //return func.apply(null, arguments);
    if (lastArg1 === arguments[0] && lastArg2 === arguments[1]) {
      return lastResult;
    } else {
      lastResult = func.apply(null, arguments);
      lastArg1 = arguments[0];
      lastArg2 = arguments[1];
      return lastResult;
    }
  };
}

module.exports = memoizeLastCall(uri.resolve);
