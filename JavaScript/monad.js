'use strict';

class Monad {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static of(value) {
    return new Monad(value);
  }

  map(fn) {
    const value = structuredClone(this.#value);
    return Monad.of(fn(value));
  }

  chain(fn) {
    const value = structuredClone(this.#value);
    return fn(value);
  }

  ap(container) {
    const fn = this.#value;
    return container.map(fn);
  }

  tap(fn) {
    fn(this.#value);
    return this;
  }
}

const move = (d) => ({ x, y }) => ({ x: x + d.x, y: y + d.y });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => Monad.of(`(${x}, ${y})`);

// Usage

const p1 = Monad.of({ x: 10, y: 20 });
p1.chain(toString).tap(console.log);
const c0 = p1.map(clone);
const t1 = Monad.of(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.chain(toString).tap(console.log);
