'use strict';

const { EventEmitter } = require('node:events');

class Point {
  #x;
  #y;

  constructor({ x, y }, emitter) {
    this.#x = x;
    this.#y = y;

    emitter.on('move', ({ x, y }) => {
      this.#x += x;
      this.#y += y;
    });

    emitter.on('clone', (callback) => {
      const point = new Point({ x: this.#x, y: this.#y }, emitter);
      callback(point);
    });

    emitter.on('toString', (callback) => {
      callback(`(${this.#x}, ${this.#y})`);
    });
  }
}

// Usage

const emitter = new EventEmitter();
const p1 = new Point({ x: 10, y: 20 }, emitter);
emitter.emit('toString', console.log);
emitter.emit('clone', (c0) => {
  emitter.emit('toString', console.log);
  emitter.emit('move', { x: -5, y: 10 });
  emitter.emit('toString', console.log);
});
