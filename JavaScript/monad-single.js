'use strict';

class Point {
  #x;
  #y;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
  }

  static of({ x, y }) {
    return new Point({ x, y });
  }

  map(fn) {
    const coords = { x: this.#x, y: this.#y };
    return Point.of(fn(coords));
  }

  chain(fn) {
    const coords = { x: this.#x, y: this.#y };
    return fn(coords);
  }
}

class PointTransform {
  constructor(fn) {
    this.fn = fn;
  }

  ap(point) {
    return point.map(this.fn);
  }
}

class Serialized {
  #data;

  constructor(data) {
    this.#data = data;
  }

  map(fn) {
    fn(this.#data);
    return this;
  }

  tap(fn) {
    fn(this.#data);
    return this;
  }
}

const move = (d) => ({ x, y }) => ({ x: x + d.x, y: y + d.y });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => new Serialized(`(${x}, ${y})`);

// Usage

const p1 = Point.of({ x: 10, y: 20 });
p1.chain(toString).tap(console.log);
const c0 = p1.map(clone);
const t1 = new PointTransform(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.chain(toString).tap(console.log);
