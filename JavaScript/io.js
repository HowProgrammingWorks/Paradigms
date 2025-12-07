'use strict';

class IO {
  #effect;

  constructor(effect) {
    this.#effect = effect;
  }

  static of(effect) {
    return new IO(effect);
  }

  map(fn) {
    return IO.of(() => fn(this.run()));
  }

  chain(fn) {
    return fn(this.run());
  }

  run() {
    return this.#effect();
  }
}

class Monad {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static of(value) {
    return new Monad(value);
  }

  map(fn) {
    const v = structuredClone(this.#value);
    return Monad.of(fn(v));
  }

  chain(fn) {
    const v = structuredClone(this.#value);
    return fn(v);
  }

  ap(container) {
    return container.map(this.#value);
  }
}

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const createPoint = (x, y) => {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return { x, y };
};

const move = (delta) => (point) => ({
  x: point.x + delta.x,
  y: point.y + delta.y,
});
const clone = (point) => ({ ...point });
const toString = (point) => `(${point.x}, ${point.y})`;

// Usage

const readPoint = () => IO.of(() => createPoint(10, 20));
const writeLine = (text) => IO.of(() => console.log(text));

const p1 = readPoint().map(Monad.of).run();
p1.map(toString).chain(writeLine).run();
const c0 = p1.map(clone);
const t1 = Monad.of(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.map(toString).chain(writeLine).run();
