'use strict';

exports.__esModule = true;
exports.debounce = debounce;
exports.fetchWithCancel = fetchWithCancel;
exports.preventAndCall = preventAndCall;

require('whatwg-fetch');

/**
 * Creates and returns a new debounced version of the passed function
 * which will postpone its execution until after wait milliseconds have
 * elapsed since the last time it was invoked.
 *
 * Check out {@link http://underscorejs.org/#debounce}
 * @param {Function} fn - callback
 * @param {Number} delay - delay in ms
 * @returns {function(...[*])}
 */
function debounce(fn, delay) {
  var timer = null;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (timer) {
      timer = clearTimeout(timer);
    }

    timer = setTimeout(function () {
      timer = null;
      fn.apply(undefined, args);
    }, delay);
  };
}

/**
 * Fetch method wrapper that could be canceled
 * @param args
 * @returns {{promise: Promise.<TResult>, cancel: (function(): boolean)}}
 */
function fetchWithCancel() {
  var canceled = false;

  return {
    promise: fetch.apply(undefined, arguments).then(function (resp) {
      return resp.json().then(function (value) {
        return [canceled, value];
      });
    }),
    cancel: function cancel() {
      return canceled = true;
    }
  };
}

/**
 * Prevent default for input event and call input function
 * @param {Function} fn - handler function
 * @param args - rest arguments
 * @returns {function(*)}
 */
function preventAndCall(fn) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return function (event) {
    event.preventDefault();
    fn.apply(undefined, args);
  };
}