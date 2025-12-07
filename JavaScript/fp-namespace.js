'use strict';

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const point = {
  create: (x, y) => {
    const errors = validatePoint(x, y);
    if (errors.length > 0) {
      const cause = new AggregateError(errors, 'Validation');
      throw new RangeError('Bad coordinates', { cause });
    }
    return Object.freeze({ x, y });
  },
  move: ({ x, y }, dx, dy) => ({ x: x + dx, y: y + dy }),
  clone: ({ x, y }) => point.create(x, y),
  toString: ({ x, y }) => `(${x}, ${y})`,
};

// Usage

const p1 = point.create(10, 20);
console.log(point.toString(p1));
const c0 = point.clone(p1);
console.log(point.toString(c0));
const c1 = point.move(p1, -5, 10);
console.log(point.toString(c1));
