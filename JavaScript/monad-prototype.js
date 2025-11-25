'use strict';

function Point({ x, y }) {
  const map = (fn) => {
    const coord = fn({ x, y });
    return new Point({ x: coord.x, y: coord.y });
  };
  const chain = (fn) => fn({ x, y });
  return { map, chain };
}

Point.of = ({ x, y }) => new Point({ x, y });

function PointTransform(fn) {
  const ap = (point) => point.map(fn);
  return { ap };
}

function Serialized(data) {
  const map = (fn) => fn(data);
  const tap = (fn) => {
    fn(data);
    return { map, tap };
  };
  return { map, tap };
}

const move = (d) => ({ x, y }) => ({ x: x + d.x, y: y + d.y });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => new Serialized(`(${x}, ${y})`);

// Usage

const p1 = Point.of({ x: 10, y: 20 });
p1.chain(toString).tap(console.log);
const c0 = p1.map(clone);
const t1 = new PointTransform(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.chain(toString).tap(console.log);
