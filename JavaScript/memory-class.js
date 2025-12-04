'use strict';

class Point {
  static SIZE = 8;

  constructor(x, y, view = null) {
    const buffer = new SharedArrayBuffer(Point.SIZE);
    this.view = new Int32Array(buffer);
    if (view) {
      this.view.set(view);
    } else {
      this.view[0] = x;
      this.view[1] = y;
    }
  }

  move(dx, dy) {
    Atomics.add(this.view, 0, dx);
    Atomics.add(this.view, 1, dy);
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
