module.exports = class MethodProxy {

  constructor(info = {}) {
    this.chain = [];
    this.info = info;
    return new Proxy(this, {

      get: (target, prop) => {
        if (prop in target) return target[prop];
        return (...args) => {
          target.chain.push({ method: prop, args, ...target.info });
          return target;
        };
      },

    });
  }

}