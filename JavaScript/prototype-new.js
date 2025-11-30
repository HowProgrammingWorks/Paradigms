'use strict';

const proto = Object.create(null);

function Point(x, y) {
  const self = Object.create(proto);
  self.x = x;
  self.y = y;
  return self;
}

proto.clone = function () {
  return new Point(this.x, this.y);
};

proto.move = function (dx, dy) {
  this.x += dx;
  this.y += dy;
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
