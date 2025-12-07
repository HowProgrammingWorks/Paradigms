'use strict';

const createIO = (effect) => ({
  map: (fn) => createIO(() => fn(effect())),
  chain: (fn) => fn(effect()),
  run: () => effect(),
});

const createMonad = (value) => ({
  map: (fn) => createMonad(fn(structuredClone(value))),
  chain: (fn) => fn(structuredClone(value)),
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
  return { x, y };
};

const move = (delta) => (point) => ({
  x: point.x + delta.x,
  y: point.y + delta.y,
});
const clone = (point) => ({ ...point });
const toString = (point) => `(${point.x}, ${point.y})`;

// Usage

const readPoint = () => createIO(() => createPoint(10, 20));
const writeLine = (text) => createIO(() => console.log(text));

const p1 = readPoint().map(createMonad).run();
p1.map(toString).chain(writeLine).run();
const c0 = p1.map(clone);
const t1 = createMonad(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.map(toString).chain(writeLine).run();
