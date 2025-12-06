'use strict';

const validate = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const proto = Object.create(null);

function Point(x, y) {
  const errors = validate(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  const self = Object.create(proto);
  self.x = x;
  self.y = y;
  return self;
}

proto.clone = function () {
  return new Point(this.x, this.y);
};

proto.move = function (x, y) {
  this.x += x;
  this.y += y;
};

proto.toString = function () {
  return `(${this.x}, ${this.y})`;
};

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
