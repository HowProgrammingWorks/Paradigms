'use strict';

const { EventEmitter } = require('node:events');

class Point {
  #x;
  #y;

  constructor({ x, y }, emitter) {
    const errors = Point.validate(x, y);
    if (errors.length > 0) {
      const cause = new AggregateError(errors, 'Validation');
      throw new RangeError('Bad coordinates', { cause });
    }
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

  static validate(x, y) {
    const errors = [];
    if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
    if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
    return errors;
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
