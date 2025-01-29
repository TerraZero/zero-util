module.exports = class UniqueArray {

  constructor(array) {
    this.array = [];
    this.itemMethod = (v) => v;
    this.sortMethod = (a, b) => {
      a = this.itemMethod(a);
      b = this.itemMethod(b);
      if (typeof b === 'string') {
        return a.compareLocal(b);
      } else {
        return a - b;
      }
    }
    this.setArray(array);
  }

  setItemMethod(callback) {
    this.itemMethod = callback;
    return this;
  }

  setSortMethod(callback) {
    this.sortMethod = callback;
    return this;
  }

  setArray(array) {
    if (array instanceof UniqueArray) {
      this.array = array.value();
    } else {
      this.array = array;
      this.unique();
    }
    return this;
  }

  push(...items) {
    items.map(item => {
      if (this.array.findIndex(v => this.itemMethod(v) === this.itemMethod(item)) === -1) {
        this.array.push(v);
      }
    });
    this.array.sort(this.sortMethod.bind(this));
    return this;
  }

  value() {
    return this.array;
  }

  unique() {
    const indexes = this.array.map((v, i) => {
      return this.array.indexOf(v, i) === -1 ? null : i;
    });
    indexes.reverse().map(index => {
      if (typeof index === 'number') {
        this.array.splice(index, 1);
      }
    });
    return this;
  }

}