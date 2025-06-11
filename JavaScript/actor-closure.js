'use strict';

class Observer {
  update(subject, data) {
    console.log(`[Observer] ${subject.constructor.name} changed:`, data);
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
    return this.toString();
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

class ObservablePoint {
  constructor(x, y) {
    this.point = new Point(x, y);
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notify(method, ...args) {
    for (const obs of this.observers) {
      obs.update(this, { method, args, state: this.point.toString() });
    }
  }

  move(dx, dy) {
    const result = this.point.move(dx, dy);
    this.notify('move', dx, dy);
    return result;
  }

  toString() {
    return this.point.toString();
  }

  clone() {
    const cloned = new ObservablePoint(this.point.x, this.point.y);
    this.observers.forEach(obs => cloned.addObserver(obs));
    return cloned;
  }
}

class Actor {
  constructor(entity) {
    this.entity = entity;
    this.queue = [];
    this.processing = false;
  }

  async send({ method, args = [] }) {
    return new Promise((resolve) => {
      this.queue.push({ method, args, resolve });
      this._processQueue();
    });
  }

  async _processQueue() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const { method, args, resolve } = this.queue.shift();
      const fn = this.entity[method];
      if (typeof fn === 'function') {
        const result = await fn.apply(this.entity, args);
        resolve(result);
      } else {
        resolve(undefined);
      }
    }
    this.processing = false;
  }
}

const main = async () => {
  const observer = new Observer();

  const p1 = new ObservablePoint(10, 20);
  p1.addObserver(observer);

  const actorP1 = new Actor(p1);
  console.log(await actorP1.send({ method: 'toString' }));

  const clone = await actorP1.send({ method: 'clone' });
  const actorClone = new Actor(clone);

  await actorClone.send({ method: 'move', args: [-5, 10] });
  console.log(await actorClone.send({ method: 'toString' }));
};

main();
