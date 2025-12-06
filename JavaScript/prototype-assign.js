'use strict';

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const clone = function () {
  return new Point(this.x, this.y);
};

const move = function (x, y) {
  this.x += x;
  this.y += y;
};

const toString = function () {
  return `(${this.x}, ${this.y})`;
};

function Point(x, y) {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  this.x = x;
  this.y = y;
  Object.assign(this, { clone, move, toString });
}

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
