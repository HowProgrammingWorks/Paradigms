'use strict';

const PointDSL = {
  [Symbol.for('tag')]: 'point',

  create: ({ x, y }) => {
    const errors = [];
    if (!Number.isFinite(x)) errors.push(new TypeError(`Invalid x: ${x}`));
    if (!Number.isFinite(y)) errors.push(new TypeError(`Invalid y: ${y}`));
    if (errors.length > 0) {
      const cause = new AggregateError(errors, 'Validation');
      throw new RangeError('Bad coordinates', { cause });
    }
    return { x, y };
  },
  clone: ({ point }) => ({ x: point.x, y: point.y }),
  move: ({ point, dx, dy }) => ({ x: point.x + dx, y: point.y + dy }),
  toString: ({ point }) => `(${point.x}, ${point.y})`,
};

const execute = (dsl, steps) => {
  const tag = dsl[Symbol.for('tag')];
  let instance = null;
  for (const step of steps) {
    const op = Object.keys(step)[0];
    const operation = dsl[op];
    const args = { ...step[op], [tag]: instance };
    instance = operation(args);
    if (step.log) {
      console.log(dsl.toString({ [tag]: instance }));
    }
  }
  return instance;
};

// Usage

const steps = [
  { create: { x: 10, y: 20 }, log: true },
  { clone: {} },
  { move: { dx: -5, dy: 10 }, log: true },
];

execute(PointDSL, steps);
