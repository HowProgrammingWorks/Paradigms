'use strict';

class Point {
  static SIZE = 8;

  constructor(x, y, view = null) {
    if (!view) {
      const errors = Point.validate(x, y);
      if (errors.length > 0) {
        const cause = new AggregateError(errors, 'Validation');
        throw new RangeError('Bad coordinates', { cause });
      }
    }
    const buffer = new SharedArrayBuffer(Point.SIZE);
    this.view = new Int32Array(buffer);
    if (view) {
      this.view.set(view);
    } else {
      this.view[0] = x;
      this.view[1] = y;
    }
  }

  static validate(x, y) {
    const errors = [];
    if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
    if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
    return errors;
  }

  move(x, y) {
    Atomics.add(this.view, 0, x);
    Atomics.add(this.view, 1, y);
  }

  clone() {
    return new Point(0, 0, this.view);
  }

  toString() {
    const x = Atomics.load(this.view, 0);
    const y = Atomics.load(this.view, 1);
    return `(${x}, ${y})`;
  }
}

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
