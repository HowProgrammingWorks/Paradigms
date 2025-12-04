'use strict';

class Actor {
  #queue = [];
  #processing = false;
  #state = null;

  constructor(Entity, ...args) {
    this.#state = new Entity(...args);
  }

  async send({ method, args = [] }) {
    return new Promise((resolve) => {
      this.#queue.push({ method, args, resolve });
      this.#process();
    });
  }

  async #process() {
    if (this.#processing) return;
    this.#processing = true;
    while (this.#queue.length) {
      const { method, args, resolve } = this.#queue.shift();
      if (typeof this.#state[method] === 'function') {
        const result = await this.#state[method](...args);
        resolve(result);
      }
    }
    this.#processing = false;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  clone() {
    return new Actor(Point, this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

// Usage

const main = async () => {
  const p1 = new Actor(Point, 10, 20);
  console.log(await p1.send({ method: 'toString' }));
  const c1 = await p1.send({ method: 'clone' });
  await c1.send({ method: 'move', args: [-5, 10] });
  console.log(await c1.send({ method: 'toString' }));
};

main();
