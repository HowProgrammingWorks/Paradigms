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

const createPoint = ({ x, y }) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return { x, y };
};

const move = (d) => (p) => ({ x: p.x + d.x, y: p.y + d.y });
const clone = ({ x, y }) => createPoint({ x, y });
const toString = ({ x, y }) => Monad.of(`(${x}, ${y})`);

// Usage

const p1 = Monad.of(createPoint({ x: 10, y: 20 }));
p1.chain(toString).tap(console.log);
const c0 = p1.map(clone);
const t1 = Monad.of(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.chain(toString).tap(console.log);
