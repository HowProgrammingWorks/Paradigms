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

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

const createPoint = (x, y) => {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  return (map) => map(x, y);
};

const move = (dx, dy) => (map) => map((x, y) => createPoint(x + dx, y + dy));
const clone = (map) => map((x, y) => createPoint(x, y));
const toString = (map) => map((x, y) => `(${x}, ${y})`);

// Usage

const readPoint = () => createIO(() => createPoint(10, 20));
const writeLine = (text) => createIO(() => console.log(text));

const p1 = readPoint().map(createMonad).run();
p1.map(toString).chain(writeLine).run();
const c0 = p1.map(clone);
const t1 = createMonad(move(-5, 10));
const c1 = t1.ap(c0);
c1.map(toString).chain(writeLine).run();
