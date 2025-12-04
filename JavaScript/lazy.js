'use strict';

const createPoint = (x, y) => ({
  x: () => x,
  y: () => y,
});

const move = (point, dx, dy) => ({
  x: () => point.x() + dx,
  y: () => point.y() + dy,
});

const clone = (point) => ({
  x: () => point.x(),
  y: () => point.y(),
});

const toString = (point) => {
  const x = point.x();
  const y = point.y();
  return `(${x}, ${y})`;
};

// Usage

const p1 = createPoint(10, 20);
console.log(toString(p1));
const c1 = clone(p1);
const c2 = move(c1, -5, 10);
console.log(toString(c2));
