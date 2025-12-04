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

const createPoint = (x, y) => {
  const point = { x, y };
  return Object.assign(point, Movable, Clonable, Serializable);
};

// Usage

const p1 = createPoint(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
