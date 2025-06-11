'use strict';

const EventEmitter = require('events');

const events = () => {
  const emitter = new EventEmitter();

  return {
    on: (event, handler) => emitter.on(event, handler),
    off: (event, handler) => emitter.off(event, handler),
    emit: (event, payload) => emitter.emit(event, payload),
  };
};

const createPoint = (ax, ay) => {
  let x = ax;
  let y = ay;

  const move = (dx, dy) => {
    x += dx;
    y += dy;
    api.emit('moved', { x, y });
  };

  const clone = () => createPoint(x, y);
  const toString = () => `(${x}, ${y})`;

  const api = { move, clone, toString, ...events() };
  return api;
};

// Usage

const p1 = createPoint(10, 20);

p1.on('moved', ({ x, y }) => {
  console.log(`Point moved to: (${x}, ${y})`);
});

console.log(p1.toString());

p1.move(5, 5);
console.log(p1.toString());

const c1 = p1.clone();

c1.on('moved', ({ x, y }) => {
  console.log(`Clone moved to: (${x}, ${y})`);
});

c1.move(-5, 10);
console.log(c1.toString());
