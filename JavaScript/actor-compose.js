'use strict';

const EventEmitter = require('events');

class Point extends EventEmitter {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.emit('updated', this); 
  }

  clone() {
    const cloned = new Point(this.x, this.y);
    this.emit('cloned', cloned);
    return cloned;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

class Actor {
  #queue = [];
  #processing = false;

  constructor(entity) {
    this.entity = entity;

    this.entity.on('updated', (state) => {
      console.log('[Observer] Point was updated:', state.toString());
    });

    this.entity.on('cloned', (clone) => {
      console.log('[Observer] Point was cloned:', clone.toString());
    });
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
      if (typeof this.entity[method] === 'function') {
        const result = await this.entity[method](...args);
        resolve(result);
      } else {
        resolve(undefined);
      }
    }

    this.#processing = false;
  }
}

const main = async () => {
  const p1 = new Actor(new Point(10, 20));
  console.log(await p1.send({ method: 'toString' }));

  const clonedPoint = await p1.send({ method: 'clone' });
  const c1 = new Actor(clonedPoint);

  await c1.send({ method: 'move', args: [-5, 10] });
  console.log(await c1.send({ method: 'toString' }));
};

main();
