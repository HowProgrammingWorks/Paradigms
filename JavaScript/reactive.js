'use strict';

class Observable {
  constructor(value) {
    this.value = value;
    this.subscribers = [];
  }

  subscribe(fn) {
    this.subscribers.push(fn);
    fn(this.value);
    return () => {
      this.subscribers = this.subscribers.filter((f) => f !== fn);
    };
  }

  next(value) {
    this.value = value;
    this.subscribers.forEach((fn) => fn(value));
  }

  map(fn) {
    const obs = new Observable(fn(this.value));
    this.subscribe((v) => obs.next(fn(v)));
    return obs;
  }
}

const createPoint = (x, y) => new Observable({ x, y });
const move = (point, dx, dy) =>
  point.map(({ x, y }) => ({ x: x + dx, y: y + dy }));
const clone = (point) => new Observable({ ...point.value });
const toString = (point) => point.map(({ x, y }) => `(${x}, ${y})`);

// Usage

const p1 = createPoint(10, 20);
toString(p1).subscribe(console.log);
const c1 = clone(p1);
const c2 = move(c1, -5, 10);
toString(c2).subscribe(console.log);
