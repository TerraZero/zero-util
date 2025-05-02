module.exports = class TimingUtil {

  /**
   * @param {Function} func 
   * @param {number} delay 
   * @param {?Function} instant 
   * @returns {Function}
   */
  static debounce(func, delay = 300, instant = null) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
      if (typeof instant === 'function') {
        instant.apply(this, args);
      }
    };
  }

}