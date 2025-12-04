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
      return this;
    });

    Point.#bus.on(`clone:${this.#id.description}`, () => new Point({ x: this.#x, y: this.#y }));

    Point.#bus.on(`toString:${this.#id.description}`, () => `(${this.#x}, ${this.#y})`);
  }

  emit(type, payload) {
    const listener = Point.#bus.listeners(`${type}:${this.#id.description}`)[0];
    if (!listener) throw new Error(`Unknown event: ${type}`);
    return listener(payload);
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
console.log(p1.emit('toString'));

const c1 = p1.emit('clone');
console.log(c1.emit('toString'));

c1.emit('move', { x: -5, y: 10 });
console.log(c1.emit('toString'));
