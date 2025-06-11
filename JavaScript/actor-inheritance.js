'use strict';

const { EventEmitter } = require('events');

class Actor {
  #queue = [];
  #processing = false;
  #entity;

  constructor(entity) {
    this.#entity = entity;
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
      if (typeof this.#entity[method] === 'function') {
        const result = await this.#entity[method](...args);
        resolve(result);
      } else {
        console.warn(`Method "${method}" not found on entity.`);
        resolve(undefined);
      }
    }
    this.#processing = false;
  }
}

class Point extends EventEmitter {
  #x;
  #y;

  constructor(x, y) {
    super();
    this.#x = x;
    this.#y = y;
  }

  move(dx, dy) {
    this.#x += dx;
    this.#y += dy;
    this.emit('updated', { x: this.#x, y: this.#y });
  }

  clone() {
    const clone = new Point(this.#x, this.#y);
    this.emit('cloned', clone);
    return clone;
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}


const main = async () => {
  const pRaw = new Point(10, 20);
  const pActor = new Actor(pRaw);

  pRaw.on('updated', ({ x, y }) => {
    console.log(`[Observer] pRaw оновлено: (${x}, ${y})`);
  });

  pRaw.on('cloned', (clone) => {
    console.log(`[Observer] Створено клон: ${clone.toString()}`);
  });

  console.log(await pActor.send({ method: 'toString' }));

  const cloneRaw = await pActor.send({ method: 'clone' });
  const cloneActor = new Actor(cloneRaw);

  cloneRaw.on('updated', ({ x, y }) => {
    console.log(`[Observer] Клон оновлено: (${x}, ${y})`);
  });

  await cloneActor.send({ method: 'move', args: [-5, 10] });
  console.log(await cloneActor.send({ method: 'toString' }));
};

main();
