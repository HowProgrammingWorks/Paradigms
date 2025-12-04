'use strict';

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.clone = function () {
  return new Point(this.x, this.y);
};

Point.prototype.move = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};

Point.prototype.toString = function () {
  return `(${this.x}, ${this.y})`;
};

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
