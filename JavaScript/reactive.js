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

const validate = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const createPoint = (x, y) => {
  const errors = validate(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return new Observable({ x, y });
};

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
