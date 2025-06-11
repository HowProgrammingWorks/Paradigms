'use strict';

const PointValidator = require('../Utils/point-validator');

class Point {
  #currentX;
  #currentY;
  #queue = [];
  #processing = false;

  constructor(initialX, initialY) {
    PointValidator.validateCoordinates(initialX, initialY);
    this.#currentX = initialX;
    this.#currentY = initialY;
  }

  static #handlers = {
    move: ({ self, deltaX, deltaY })  => self.#move(deltaX, deltaY),
    clone: ({ self })      => self.#clone(),
    toString: ({ self })   => self.#toString(),
  };

  #move(deltaX, deltaY) {
    PointValidator.validateCoordinates(deltaX, deltaY);
    this.#currentX += deltaX;
    this.#currentY += deltaY;
  }

  #clone() {
    return new Point(this.#currentX, this.#currentY);
  }

  #toString() {
    return `(${this.#currentX}, ${this.#currentY})`;
  }

  async send(options) {
    return new Promise((resolve) => {
      this.#queue.push({ ...options, resolve });
      this.#process();
    });
  }

  async #process() {
    if (this.#processing) return;
    this.#processing = true;
    while (this.#queue.length) {
      const { method, deltaX, deltaY, resolve } = this.#queue.shift();
      const handler = Point.#handlers[method];
      if (!handler) return;
      resolve(handler({ self: this, deltaX, deltaY }));
    }
    this.#processing = false;
  }
}

// Usage

const main = async () => {
  const p1 = new Point(10, 20);
  console.log(await p1.send({ method: 'toString' }));
  const c1 = await p1.send({ method: 'clone' });
  await c1.send({ method: 'move', deltaX: -5, deltaY: 10 });
  console.log(await c1.send({ method: 'toString' }));
};

main();
