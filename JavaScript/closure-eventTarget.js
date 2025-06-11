'use strict';

const withEventTarget = () => {
  const target = new EventTarget();

  return {
    on: (event, handler) => target.addEventListener(event, handler),
    off: (event, handler) => target.removeEventListener(event, handler),
    emit: (event, payload) => {
      target.dispatchEvent(new CustomEvent(event, { detail: payload }));
    }
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

  const api = { move, clone, toString, ...withEventTarget() };
  return api;
};

// Usage

const p1 = createPoint(10, 20);

p1.on('moved', (event) => {
  const { x, y } = event.detail;
  console.log(`Point moved to: (${x}, ${y})`);
});

console.log(p1.toString());

p1.move(5, 5);
console.log(p1.toString());

const c1 = p1.clone();

c1.on('moved', (event) => {
  const { x, y } = event.detail;
  console.log(`Clone moved to: (${x}, ${y})`);
});

c1.move(-5, 10);
console.log(c1.toString());
