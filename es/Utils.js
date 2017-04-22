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
export function debounce(fn, delay) {
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
export function fetchWithCancel() {
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