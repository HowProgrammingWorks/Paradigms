'use strict';

class PointEvent extends Event {
  constructor(type, detail = {}) {
    super(type);
    this.detail = detail;
  }
}

class Point {
  #x;
  #y;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
    this.target = new EventTarget();

    this.target.addEventListener('move', (event) => {
      const { x: dx, y: dy } = event.detail;
      this.#x += dx;
      this.#y += dy;
    });

    this.target.addEventListener('clone', (event) => {
      event.detail.callback(new Point({ x: this.#x, y: this.#y }));
    });

    this.target.addEventListener('toString', (event) => {
      event.detail.callback(`(${this.#x}, ${this.#y})`);
    });
  }

  emit(type, detail = {}) {
    this.target.dispatchEvent(new PointEvent(type, detail));
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
p1.emit('toString', { callback: console.log });
p1.emit('clone', {
  callback: (c1) => {
    c1.emit('toString', { callback: console.log });
    c1.emit('move', { x: -5, y: 10 });
    c1.emit('toString', { callback: console.log });
  },
});
