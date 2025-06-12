'use strict';

class Point {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  move(x, y) {
    this.#x += x;
    this.#y += y;
  }

  clone() {
    return new Point(this.#x, this.#y);
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

const aspect = (target, methodName, { before, after }) => {
  const method = target[methodName];
  target[methodName] = function (...args) {
    before?.apply(this, args);
    const result = method.apply(this, args);
    after?.call(this, result, ...args);
    return result;
  };
};

aspect(Point.prototype, 'move', {
  before(x, y) {
    console.log(`Before move: ${this.toString()} moving by (${x},${y})`);
  },
  after() {
    console.log(`After move: ${this.toString()}`);
  },
});

aspect(Point.prototype, 'clone', {
  after(result) {
    console.log(`After clone: ${result.toString()}`);
  },
});

// Usage

const p1 = new Point(10, 20);
const c1 = p1.clone();
c1.move(-5, 10);
