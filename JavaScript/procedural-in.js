'use strict';

const validatePoint = (x, y, errors) => {
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
};

const createPoint = (point, x, y) => {
  const errors = [];
  validatePoint(x, y, errors);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  point.x = x;
  point.y = y;
};

const clone = (src, dest) => {
  dest.x = src.x;
  dest.y = src.y;
};

const move = (point, dx, dy) => {
  point.x += dx;
  point.y += dy;
};

const toString = (point, buffer) => {
  buffer.value = `(${point.x}, ${point.y})`;
};

// Usage

const p1 = {};
createPoint(p1, 10, 20);
const result = {};
toString(p1, result);
console.log(result.value);
const c1 = {};
clone(p1, c1);
move(c1, -5, 10);
toString(c1, result);
console.log(result.value);
