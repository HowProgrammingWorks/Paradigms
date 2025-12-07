'use strict';

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const match = (variant, handlers) => handlers[variant.tag](variant);

// Implementation

const createPoint = (x, y) => {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return Object.freeze({ tag: 'point', x, y });
};

const move = (instance, dx, dy) =>
  match(instance, {
    point: ({ x, y }) => createPoint(x + dx, y + dy),
  });

const clone = (instance) =>
  match(instance, {
    point: ({ x, y }) => createPoint(x, y),
  });

const toString = (instance) =>
  match(instance, {
    point: ({ x, y }) => `(${x}, ${y})`,
  });

// Usage

const p1 = createPoint(10, 20);
console.log(toString(p1));
const c0 = clone(p1);
console.log(toString(c0));
const c1 = move(p1, -5, 10);
console.log(toString(c1));
