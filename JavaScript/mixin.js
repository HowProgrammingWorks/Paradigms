'use strict';

const Movable = {
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  },
};

const Clonable = {
  clone() {
    const prototype = Object.getPrototypeOf(this);
    const cloned = Object.create(prototype);
    return Object.assign(cloned, this);
  },
};

const Serializable = {
  toString() {
    return `(${this.x}, ${this.y})`;
  },
};

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
  return Object.assign(point, Movable, Clonable, Serializable);
};

// Usage

const p1 = createPoint(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
