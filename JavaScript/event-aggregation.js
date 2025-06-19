'use strict';

const { EventEmitter } = require('node:events');

class Point {
  static #bus = new EventEmitter();

  #x;
  #y;
  #id;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
    this.#id = Symbol('point');

    Point.#bus.on(`move:${this.#id.description}`, ({ x, y }) => {
      this.#x += x;
      this.#y += y;
    });

    Point.#bus.on(`clone:${this.#id.description}`, (callback) => {
      callback(new Point({ x: this.#x, y: this.#y }));
    });

    Point.#bus.on(`toString:${this.#id.description}`, (callback) => {
      callback(`(${this.#x}, ${this.#y})`);
    });
  }

  move(delta) {
    Point.#bus.emit(`move:${this.#id.description}`, delta);
    return this;
  }

  clone() {
    let copy;
    Point.#bus.emit(`clone:${this.#id.description}`, (c) => (copy = c));
    return copy;
  }

  toString() {
    let str;
    Point.#bus.emit(`toString:${this.#id.description}`, (s) => (str = s));
    return str;
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
console.log(p1.toString());

const c1 = p1.clone();
console.log(c1.toString());

c1.move({ x: -5, y: 10 });
console.log(c1.toString());
