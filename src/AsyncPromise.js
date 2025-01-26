const { v4: UUID } = require('uuid');

const ErrorUtil = require('./ErrorUtil');

module.exports = class AsyncPromise {

  /** @returns {Object<string, AsyncPromise>} */
  static get register() {
    if (this._register === undefined) {
      this._register = {};
    }
    return this._register;
  }

  /**
   * @param {string} uuid 
   * @returns {?AsyncPromise}
   */
  static get(uuid) {
    return this.register[uuid] ?? null;
  }

  /**
   * @param {AsyncPromise} promise 
   */
  static add(promise) {
    this.register[promise.uuid] = promise;
  }

  /**
   * @param {AsyncPromise} promise 
   */
  static remove(promise) {
    delete this.register[promise.uuid];
  }

  static resolve(uuid, value = null) {
    this.register[uuid].resolve(value);
  }

  static reject(uuid, value = null) {
    this.register[uuid].reject(value);
  }

  constructor() {
    this._res = null;
    this._rej = null;
    this._timeout = null;
    this.promise = new Promise((res, rej) => {
      this._res = res;
      this._rej = rej;
    });
    this.stack = ErrorUtil.getStack(null, 0);
    this.uuid = UUID();
    this.constructor.add(this);
  }

  timeout(time) {
    this._timeout = setTimeout(() => {
      this.reject(ErrorUtil.appendStack(new Error('AsyncPromise.timeout ' + this.uuid), this.stack, 'CREATE'));
    }, time);
    return this;
  }

  resolve(value) {
    this._res(value);
    this.remove();
    return this;
  }

  reject(value) {
    this._rej(value);
    this.remove();
    return this;
  }

  remove() {
    clearTimeout(this._timeout);
    this.constructor.remove(this);
  }

}