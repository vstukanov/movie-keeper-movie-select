import 'whatwg-fetch';

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
export function debounce (fn, delay) {
  let timer = null;

  return (...args) => {
    if (timer) {
      timer = clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  }
}

/**
 * Fetch method wrapper that could be canceled
 * @param args
 * @returns {{promise: Promise.<TResult>, cancel: (function(): boolean)}}
 */
export function fetchWithCancel (...args) {
  let canceled = false;

  return {
    promise: fetch(...args).then(resp =>
      resp.json()
        .then(value => [canceled, value])
    ),
    cancel: () => canceled = true
  };
}

/**
 * Prevent default for input event and call input function
 * @param {Function} fn - handler function
 * @param args - rest arguments
 * @returns {function(*)}
 */
export function preventAndCall (fn, ...args) {
  return event => {
    event.preventDefault();
    fn(...args);
  };
}
