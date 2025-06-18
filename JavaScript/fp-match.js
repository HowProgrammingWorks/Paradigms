'use strict';

const match = (variant, handlers) => handlers[variant.tag](variant);

// Implementation

const createPoint = (x, y) => Object.freeze({ tag: 'point', x, y });

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
