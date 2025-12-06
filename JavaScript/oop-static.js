'use strict';

class Point {
  constructor(x, y) {
    const errors = Point.validate(x, y);
    if (errors.length > 0) {
      const cause = new AggregateError(errors, 'Validation');
      throw new RangeError('Bad coordinates', { cause });
    }
    this.x = x;
    this.y = y;
  }

  static validate(x, y) {
    const errors = [];
    if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
    if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
    return errors;
  }

  static move(point, x, y) {
    point.x += x;
    point.y += y;
  }

  static clone({ x, y }) {
    return new Point(x, y);
  }

  static toString({ x, y }) {
    return `(${x}, ${y})`;
  }
}

// Usage

const p1 = new Point(10, 20);
console.log(Point.toString(p1));
const c1 = Point.clone(p1);
Point.move(c1, -5, 10);
console.log(Point.toString(c1));
