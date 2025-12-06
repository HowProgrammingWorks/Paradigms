'use strict';

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const createPoint = (x, y) => {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  const point = { x, y };
  return point;
};

const clone = (point) => {
  const { x, y } = point;
  return createPoint(x, y);
};

const move = (point, x, y) => {
  point.x += x;
  point.y += y;
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
