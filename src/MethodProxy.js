module.exports = class MethodProxy {

  constructor(info = {}) {
    this.chain = [];
    this.info = info;
    return new Proxy(this, {

      get: (target, prop) => {
        if (prop in target) return target[prop];
        return (...params) => {
          target.chain.push({ method: prop, params, ...target.info });
          return target;
        };
      },

    });
  }

}