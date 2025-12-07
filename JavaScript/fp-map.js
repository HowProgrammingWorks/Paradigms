'use strict';

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

const move = (dx) => (dy) => ({ x, y }) => createPoint(x + dx)(y + dy);
const clone = ({ x, y }) => createPoint(x)(y);
const toString = ({ x, y }) => `(${x}, ${y})`;

// Usage

const p1 = createPoint(10)(20);
console.log(p1.map(toString));
const c0 = p1.map(clone);
console.log(c0.map(toString));
const c1 = p1.map(move(-5)(10));
console.log(c1.map(toString));
