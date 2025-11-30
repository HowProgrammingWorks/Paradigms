'use strict';

class PointEvent extends Event {
  constructor(type, detail = {}) {
    super(type);
    this.detail = detail;
    this.result = undefined;
  }
}

class Point {
  #x;
  #y;
  #target;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
    this.#target = new EventTarget();

    this.#target.addEventListener('move', (e) => {
      const { x: dx, y: dy } = e.detail;
      this.#x += dx;
      this.#y += dy;
      e.result = this;
    });

    this.#target.addEventListener('clone', (e) => {
      e.result = new Point({ x: this.#x, y: this.#y });
    });

    this.#target.addEventListener('toString', (e) => {
      e.result = `(${this.#x}, ${this.#y})`;
    });
  }

  emit(type, detail = {}) {
    const event = new PointEvent(type, detail);
    this.#target.dispatchEvent(event);
    return event.result;
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
console.log(p1.emit('toString'));

const c1 = p1.emit('clone');
console.log(c1.emit('toString'));

c1.emit('move', { x: -5, y: 10 });
console.log(c1.emit('toString'));
