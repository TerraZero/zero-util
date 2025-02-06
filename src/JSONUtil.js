/**
 * @typedef {Object} T_QueryInfo
 * @property {Object} data
 * @property {string} query
 * @property {any} fallback
 * @property {JSONQuery.Locals} methods
 */

const JSONQuery = require('json-query');

module.exports = class JSONUtil {

  static GLOBAL_PATH_METHODS = {

    includes: function(input, ...args) {
      if (Array.isArray(input)) {
        for (const arg of args) {
          if (input.includes(arg)) return input;
        }
      }
      return false;
    },

    hasSome: function(input, ...checks) {
      for (const check of checks) {
        if (check) return input;
      }
      return false;
    },

    hasAll: function(input, ...checks) {
      for (const check of checks) {
        if (!check) return false;
      }
      return input;
    },

    split: function(input, seperator = ' ') {
      return input.split(seperator);
    },

    join: function(input, seperator = ' ') {
      return input.join(seperator);
    },

  };

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} fallback
   * @returns {any}
   */
  static getDeep(data, name, fallback = null) {
    const splits = name.split('.');

    for (const split of splits) {
      if (data === undefined) return fallback;
      data = data[split];
    }
    return (data === undefined ? fallback : data);
  }

  /**
   * @param {Object} data
   * @param {string} name
   * @param {any} value
   */
  static setDeep(data, name, value) {
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    data[last] = value;
  }

  /**
   * @param {Object} data
   * @param {string} name
   */
  static removeDeep(data, name) {
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    delete data[last];
  }

  /**
   * @param {Object} data
   * @param {string} name
   */
  static removeDeepRecursive(data, name) {
    const original = data;
    const splits = name.split('.');
    const last = splits.pop();

    for (const split of splits) {
      if (data[split] === undefined) data[split] = {};
      data = data[split];
    }
    delete data[last];

    if (Object.keys(data).length === 0 && splits.length) {
      this.removeDeepRecursive(original, splits.join('.'));
    }
  }

  /**
   * @param {Object} data 
   * @param {string} query 
   * @param {*} fallback 
   * @returns {*}
   */
  static getDeepPath(data, query, fallback = null) {
    return (new JSONUtil({ data, query, fallback })).execute().getResultValue();
  }

  /**
   * @param {string} name 
   * @param {(input: JSONQuery.Context, ...args: any[]) => JSONQuery.Context} method 
   */
  static addGlobalPathMethod(name, method) {
    JSONUtil.GLOBAL_PATH_METHODS[name] = method;
  }

  /**
   * @param {T_QueryInfo} info 
   */
  constructor(info = {}) {
    this.setInfo(info);
    this.result = undefined;
  }

  /**
   * @param {T_QueryInfo} info 
   * @returns {this}
   */
  setInfo(info = {}) {
    this.data = info.data ?? this.data ?? null;
    this.query = info.query ?? this.query ?? null;
    this.fallback = info.fallback ?? this.fallback ?? undefined;
    this.methods = info.methods ?? this.methods ?? {};
    return this;
  }

  /**
   * @returns {T_QueryInfo}
   */
  getInfo() {
    return {
      data: this.data,
      query: this.query,
      fallback: this.fallback,
      methods: this.methods,
    };
  }

  /**
   * @param {Object} data 
   * @returns {this}
   */
  setData(data) {
    this.data = data;
    return this;
  }

  /**
   * @param {string} query 
   * @returns {this}
   */
  setQuery(query) {
    this.query = query;
    return this;
  }

  /**
   * @param {any} fallback 
   * @returns {this}
   */
  setFallback(fallback = undefined) {
    this.fallback = fallback;
    return this;
  }

  /**
   * @param {string} name 
   * @param {(input: JSONQuery.Context, ...args: any[]) => JSONQuery.Context} method 
   * @returns {this}
   */
  addMethod(name, method) {
    this.methods[name] = method;
    return this;
  }

  /**
   * @param {string} query 
   * @returns {this}
   */
  execute(query = null) {
    this.query = query ?? this.query;
    this.result = JSONQuery(this.query, {
      data: this.data,
      force: this.fallback,
      globals: JSONUtil.GLOBAL_PATH_METHODS,
      locals: this.methods,
    });
    return this;
  }

  /**
   * @returns {JSONQuery.Result}
   */
  getResult() {
    return this.result;
  }

  /**
   * @returns {any}
   */
  getResultValue() {
    if (this.fallback !== undefined) {
      if (this.result.value === false || this.result.value === null || this.result.value === undefined) {
        return this.fallback;
      }
    }
    return this.result.value;
  }

  /**
   * @param {T_QueryInfo} newInfo 
   * @returns {JSONUtil}
   */
  copy(newInfo = {}) {
    return (new JSONUtil(this.getInfo())).setInfo(newInfo);
  }

}