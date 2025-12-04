'use strict';

const createPoint = (x, y) => {
  const point = { x, y };
  return point;
};

const clone = (point) => {
  const { x, y } = point;
  return createPoint(x, y);
};

const move = (point, dx, dy) => {
  point.x += dx;
  point.y += dy;
};

const toString = (point) => {
  const { x, y } = point;
  return `(${x}, ${y})`;
};

// Usage

const p1 = createPoint(10, 20);
console.log(toString(p1));
const c1 = clone(p1);
move(c1, -5, 10);
console.log(toString(c1));
