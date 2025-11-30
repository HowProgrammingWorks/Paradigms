'use strict';

const clone = function () {
  return new Point(this.x, this.y);
};

const move = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};

const toString = function () {
  return `(${this.x}, ${this.y})`;
};

function Point(x, y) {
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
