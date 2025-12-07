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

class Result {
  #value = null;
  #error = null;

  constructor(value, error) {
    this.#value = value;
    this.#error = error;
  }

  static value(value) {
    return new Result(value, null);
  }

  static ok(value) {
    return Result.value(value);
  }

  static error(error) {
    return new Result(null, error);
  }

  map(fn) {
    return this.#error ? this : Result.ok(fn(this.#value));
  }

  chain(fn) {
    return this.#error ? this : fn(this.#value);
  }

  bimap(success, fail) {
    return this.#error ? fail(this.#error) : success(this.#value);
  }

  get value() {
    return this.#value;
  }

  get error() {
    return this.#error;
  }
}

const validatePoint = ({ x, y }) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors.length > 0
    ? Result.error(new AggregateError(errors, 'Validation'))
    : Result.ok({ x, y });
};


const move = (d) => ({ x, y }) => ({ x: x + d.x, y: y + d.y });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => Monad.of(`(${x}, ${y})`);

// Usage

const p1 = Monad.of({ x: 10, y: 20 }).chain(validatePoint);
p1.bimap(toString, Monad.of).tap(console.log);
const c0 = p1.map(clone);
const c1 = c0.map(move({ x: -5, y: 10 }));
c1.bimap(toString, Monad.of).tap(console.log);
