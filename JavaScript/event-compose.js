'use strict';

const { EventEmitter } = require('node:events');

class Point {
  #x;
  #y;
  #emitter;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
    this.#emitter = new EventEmitter();

    this.#emitter.on('move', ({ x, y }) => {
      this.#x += x;
      this.#y += y;
    });

    this.#emitter.on('clone', () => new Point({ x: this.#x, y: this.#y }));

    this.#emitter.on('toString', () => `(${this.#x}, ${this.#y})`);
  }

  emit(eventName, arg) {
    const listener = this.#emitter.listeners(eventName)[0];
    if (!listener) throw new Error(`Unknown event: ${eventName}`);
    return listener(arg);
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
console.log(p1.emit('toString'));

const c1 = p1.emit('clone');
console.log(c1.emit('toString'));

c1.emit('move', { x: -5, y: 10 });
console.log(c1.emit('toString'));
