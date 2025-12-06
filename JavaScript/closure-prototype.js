'use strict';

function Point(x, y) {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  this.x = x;
  this.y = y;
  const move = (dx, dy) => {
    this.x += dx;
    this.y += dy;
  };
  const clone = () => new Point(this.x, this.y);
  const toString = () => `(${this.x}, ${this.y})`;
  return { move, clone, toString };
}

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
