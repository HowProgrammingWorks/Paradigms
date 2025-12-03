'use strict';

const createIO = (effect) => ({
  map: (fn) => createIO(() => fn(effect())),
  chain: (fn) => fn(effect()),
  run: () => effect(),
});

const createMonad = (value) => ({
  map: (fn) => createMonad(fn(value)),
  chain: (fn) => fn(value),
  ap: (container) => container.map(value),
});

const createPoint = (x, y) => (fn) => fn(x, y);

const move = (delta) => (point) =>
  point((x, y) => createPoint(x + delta.x, y + delta.y));
const clone = (point) => point((x, y) => createPoint(x, y));
const toString = (point) => point((x, y) => `(${x}, ${y})`);

// Usage

const readPoint = () => createIO(() => createPoint(10, 20));
const writeLine = (text) => createIO(() => console.log(text));

const p1 = readPoint().map(createMonad).run();
p1.map(toString).chain(writeLine).run();
const c0 = p1.map(clone);
const t1 = createMonad(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.map(toString).chain(writeLine).run();
