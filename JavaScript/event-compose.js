'use strict';

const { EventEmitter } = require('node:events');

class Point {
  #x;
  #y;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
    this.emitter = new EventEmitter();

    this.emitter.on('move', ({ x, y }) => {
      this.#x += x;
      this.#y += y;
    });

    this.emitter.on('clone', (callback) => {
      const point = new Point({ x: this.#x, y: this.#y });
      callback(point);
    });

    this.emitter.on('toString', (callback) => {
      callback(`(${this.#x}, ${this.#y})`);
    });
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
p1.emitter.emit('toString', console.log);
p1.emitter.emit('clone', (c1) => {
  c1.emitter.emit('toString', console.log);
  c1.emitter.emit('move', { x: -5, y: 10 });
  c1.emitter.emit('toString', console.log);
});
