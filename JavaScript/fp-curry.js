'use strict';

const curry = (fn) => (...args) => args.length >= fn.length
  ? fn(...args)
  : (...rest) => curry(fn)(...args, ...rest);

// Implementation

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const createPoint = curry((x, y) => {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return Object.freeze({ x, y });
});

const move = curry(({ x, y }, dx, dy) => createPoint(x + dx)(y + dy));
const clone = curry((point) => createPoint(point.x)(point.y));
const toString = curry((point) => `(${point.x}, ${point.y})`);

// Usage

const p1 = createPoint(10)(20);
console.log(toString(p1));
const c0 = clone(p1);
console.log(toString(c0));
const c1 = move(p1)(-5)(10);
console.log(toString(c1));
