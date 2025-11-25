'use strict';

const createPoint = (x, y) => {
  const map = (fn) => {
    const coord = fn(x, y);
    return createPoint(coord.x, coord.y);
  };
  const chain = (fn) => fn(x, y);
  return { map, chain };
};

const pointTransform = (fn) => ({ ap: (point) => point.map(fn) });
const serialized = (data) => ({
  map: (fn) => fn(data),
  tap: (fn) => {
    fn(data);
    return serialized(data);
  },
});

const move = (dx, dy) => (x, y) => ({ x: x + dx, y: y + dy });
const clone = (x, y) => ({ x, y });
const toString = (x, y) => serialized(`(${x}, ${y})`);

// Usage

const p1 = createPoint(10, 20);
p1.chain(toString).tap(console.log);
const c0 = p1.map(clone);
const t1 = pointTransform(move(-5, 10));
const c1 = t1.ap(c0);
c1.chain(toString).tap(console.log);
