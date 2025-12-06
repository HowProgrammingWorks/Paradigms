'use strict';

const validatePoint = (x, y) => {
  const errors = [];
  if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
  if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
  return errors;
};

function Point({ x, y }) {
  const errors = validatePoint(x, y);
  if (errors.length > 0) {
    const cause = new AggregateError(errors, 'Validation');
    throw new RangeError('Bad coordinates', { cause });
  }
  const move = (d) => {
    x += d.x;
    y += d.y;
  };
  const clone = () => new Point({ x, y });
  const toString = () => `(${x}, ${y})`;

  const events = { move, clone, toString };

  const emit = (eventName, args) => {
    const event = events[eventName];
    if (!event) throw new Error(`Unknown event: ${event}`);
    return event(args);
  };

  return { emit };
}

// Usage

const p1 = new Point({ x: 10, y: 20 });
console.log(p1.emit('toString'));
const c1 = p1.emit('clone');
console.log(c1.emit('toString'));
c1.emit('move', { x: -5, y: 10 });
console.log(c1.emit('toString'));
