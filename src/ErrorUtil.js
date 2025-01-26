/**
 * @typedef {Object} T_ErrorSerialize
 * @property {string} message
 * @property {string} name
 * @property {any} stack
 */

module.exports = class ErrorUtil {

  /**
   * @param {Error} error 
   * @returns {T_ErrorSerialize}
   */
  static serialize(error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  /**
   * @param {T_ErrorSerialize} error 
   * @returns {Error}
   */
  static deserialize(error) {
    const de = new Error(error.message);
    de.name = error.name;
    de.stack = error.stack;
    return error;
  }

  /**
   * @param {Error} error 
   * @param {number} remove
   * @returns {string[]}
   */
  static getStack(error = null, remove = 0) {
    let stack = null;
    if (error === null) {
      error = new Error();
      stack = error.stack.split('\n');
      stack.shift();
      stack.shift();
    } else {
      stack = error.stack.split('\n');
    }
    for (let i = 0; i < remove; i++) {
      stack.shift();
    }
    return stack.map(line => line.trim());
  }

  /**
   * @param {Error} error 
   * @param {string[]} stack
   * @param {string} title 
   * @param {string} connector 
   * @returns {Error}
   */
  static appendStack(error, stack, title = '', connector = '--------') {
    const newStack = this.getStack(error);
    newStack.push(connector + title + connector);
    newStack.push(...stack);
    error.stack = newStack;
    return error;
  }

}