'use strict';

class Point {
  #x;
  #y;
  #events;

  constructor({ x, y }) {
    const errors = Point.validate(x, y);
    if (errors.length > 0) {
      const cause = new AggregateError(errors, 'Validation');
      throw new RangeError('Bad coordinates', { cause });
    }
    this.#x = x;
    this.#y = y;
    this.#events = {
      move: ({ x, y }) => {
        this.#x += x;
        this.#y += y;
      },
      clone: () => new Point({ x: this.#x, y: this.#y }),
      toString: () => `(${this.#x}, ${this.#y})`,
    };
  }

  static validate(x, y) {
    const errors = [];
    if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
    if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
    return errors;
  }

  emit(eventName, args) {
    const event = this.#events[eventName];
    if (!event) throw new Error(`Unknown event: ${eventName}`);
    return event(args);
  }
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
console.log(p1.emit('toString'));

const c1 = p1.emit('clone');
console.log(c1.emit('toString'));

c1.emit('move', { x: -5, y: 10 });
console.log(c1.emit('toString'));
