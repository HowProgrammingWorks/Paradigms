'use strict';

const validate = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const PointPrototype = {
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  },
  clone() {
    return Object.create(PointPrototype, {
      x: { value: this.x, writable: true },
      y: { value: this.y, writable: true },
    });
  },
  toString() {
    return `(${this.x}, ${this.y})`;
  },
};

const createPoint = (x, y) => {
  const errors = validate(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  const point = Object.create(PointPrototype);
  point.x = x;
  point.y = y;
  return point;
};

// Usage

const p1 = createPoint(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
