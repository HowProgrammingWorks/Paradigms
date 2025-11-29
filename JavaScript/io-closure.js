'use strict';

const createIO = (effect) => ({
  map: (fn) => createIO(() => fn(effect())),
  chain: (fn) => fn(effect()),
  run: () => effect(),
});


const createMonad = (value) => ({
  map: (fn) => {
    const v = structuredClone(value);
    return createMonad(fn(v));
  },
  chain: (fn) => {
    const v = structuredClone(value);
    return fn(v);
  },
  ap: (container) => container.map(value),
});


const move = (delta) => (point) => ({ x: point.x + delta.x, y: point.y + delta.y });
const clone = (point) => ({ ...point });
const toString = (point) => `(${point.x}, ${point.y})`;

// Usage

const readPoint = () => createIO(() => ({ x: 10, y: 20 }));
const writeLine = (text) => createIO(() => console.log(text));

const p1 = readPoint().map(createMonad).run();
p1.map(toString).chain(writeLine).run();
const c0 = p1.map(clone);
const t1 = createMonad(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.map(toString).chain(writeLine).run();
