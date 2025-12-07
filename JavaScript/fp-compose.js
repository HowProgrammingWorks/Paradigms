'use strict';

const pipe = (...fns) => (obj) => fns.reduce((val, f) => f(val), obj);

// Implementation

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const createPoint = (x) => (y) => {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return { map: (f) => f({ x, y }) };
};

const move = (dx) => (dy) => ({ x, y }) => ({ x: x + dx, y: y + dy });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => `(${x}, ${y})`;

// Usage

const p1 = createPoint(10)(20);
console.log(p1.map(toString));
const operations = pipe(clone, move(-5)(10), toString, console.log);
p1.map(operations);
