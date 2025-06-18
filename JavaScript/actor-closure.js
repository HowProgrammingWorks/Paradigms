'use strict';

const createActor = (Entity, ...args) => {
  const queue = [];
  let processing = false;
  const state = new Entity(...args);

  const process = async () => {
    if (processing) return;
    processing = true;
    while (queue.length) {
      const { method, args, resolve } = queue.shift();
      if (typeof state[method] === 'function') {
        const result = await state[method](...args);
        resolve(result);
      }
    }
    processing = false;
  };

  const send = async ({ method, args = [] }) =>
    new Promise((resolve) => {
      queue.push({ method, args, resolve });
      process();
    });

  return { send, process };
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  clone() {
    return createActor(Point, this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

// Usage

const main = async () => {
  const p1 = createActor(Point, 10, 20);
  console.log(await p1.send({ method: 'toString' }));
  const c1 = await p1.send({ method: 'clone' });
  await c1.send({ method: 'move', args: [-5, 10] });
  console.log(await c1.send({ method: 'toString' }));
};

main();
