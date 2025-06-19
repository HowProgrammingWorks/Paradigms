'use strict';

class Point {
  #x;
  #y;
  #queue = [];
  #processing = false;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  #move(dx, dy) {
    this.#x += dx;
    this.#y += dy;
  }

  #clone() {
    return new Point(this.#x, this.#y);
  }

  #toString() {
    return `(${this.#x}, ${this.#y})`;
  }

  async send(message) {
    return new Promise((resolve) => {
      this.#queue.push({ ...message, resolve });
      this.#process();
    });
  }

  async #process() {
    if (this.#processing) return;
    this.#processing = true;
    while (this.#queue.length) {
      const { method, x: dx, y: dy, resolve } = this.#queue.shift();
      if (method === 'move') resolve(this.#move(dx, dy));
      if (method === 'clone') resolve(this.#clone());
      if (method === 'toString') resolve(this.#toString());
    }
    this.#processing = false;
  }
}

// Usage

const main = async () => {
  const p1 = new Point(10, 20);
  console.log(await p1.send({ method: 'toString' }));
  const c1 = await p1.send({ method: 'clone' });
  await c1.send({ method: 'move', x: -5, y: 10 });
  console.log(await c1.send({ method: 'toString' }));
};

main();
