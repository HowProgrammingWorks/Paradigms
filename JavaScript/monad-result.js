'use strict';

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

  ap(container) {
    if (this.#error) return this;
    if (container.#error) return container;
    return Result.ok(this.#value(container.#value));
  }

  bimap(success, fail) {
    if (this.#error) return Result.ok(fail(this.#error));
    return Result.ok(success(this.#value));
  }

  get value() {
    return this.#value;
  }

  get error() {
    return this.#error;
  }

  tap(fn) {
    fn(this.#value);
    return this;
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

const move = (d) => (p) => ({ x: p.x + d.x, y: p.y + d.y });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => `(${x}, ${y})`;
const id = (value) => value;

// Usage

const p1 = Result.ok({ x: 10, y: 20 }).chain(validatePoint);
p1.bimap(toString, id).tap(console.log);
const c0 = p1.map(clone);
const p2 = Result.ok({ x: -5, y: 10 }).chain(validatePoint);
const m1 = Result.ok(move).ap(p2);
const c1 = m1.ap(c0);
c1.bimap(toString, id).tap(console.log);
