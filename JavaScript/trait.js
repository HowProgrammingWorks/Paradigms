'use strict';

class Ownership {
  #value = undefined;

  constructor(value) {
    this.#value = value;
  }

  get() {
    if (this.#value !== undefined) return this.#value;
    throw new Error('Moved or dropped');
  }

  move() {
    const val = this.get();
    this.#value = undefined;
    return new Ownership(val);
  }

  [Symbol.dispose]() {
    this.#value = undefined;
    this.drop();
  }
}

const implement = (target, trait, callable) => {
  target[trait] = callable;
};

const invoke = (target, trait, ...args) => {
  if (typeof target !== 'object') {
    throw new TypeError(`Target is not defiled`);
  }
  if (typeof trait !== 'symbol') {
    throw new TypeError(`Trait is not defiled`);
  }
  const callable = target[trait];
  if (typeof callable === 'function') {
    return callable(...args);
  }
  const name = Symbol.keyFor(trait);
  throw new TypeError(`Trait not implementemented: ${name}`);
};

const createPoint = (x, y) => {
  using point = new Ownership({ x, y });
  const self = Object.create(null);

  implement(self, Symbol.for('Clonable'), () => {
    const { x, y } = point.get();
    return createPoint(x, y);
  });

  implement(self, Symbol.for('Movable'), (d) => {
    const p = point.get();
    return createPoint(p.x + d.x, p.y + d.y);
  });

  implement(self, Symbol.for('Serializable'), () => {
    const { x, y } = point.get();
    return `(${x}, ${y})`;
  });

  return self;
};

// Usage

const main = async () => {
  const p1 = createPoint(10, 20);
  console.log(invoke(p1, Symbol.for('Serializable')));
  const c0 = invoke(p1, Symbol.for('Clonable'));
  console.log(invoke(c0, Symbol.for('Serializable')));
  const c1 = invoke(c0, Symbol.for('Movable'), { x: -5, y: 10 });
  console.log(invoke(c1, Symbol.for('Serializable')));
};

main();
