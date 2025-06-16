'use strict';

class Box {
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
    return new Box(val);
  }

  [Symbol.dispose]() {
    this.#value = undefined;
  }
}

class Trait {
  static #registry = new Map();
  #implementations = new WeakMap();

  constructor(name) {
    this.name = name;
    Trait.#registry.set(name, this);
  }

  static for(name) {
    return Trait.#registry.get(name) || new Trait(name);
  }

  implement(target, callable) {
    if (typeof target !== 'object') {
      throw new TypeError(`Target is not Object`);
    }
    if (typeof callable !== 'function') {
      throw new TypeError(`Callable is not Function`);
    }
    this.#implementations.set(target, callable);
  }

  invoke(box, ...args) {
    const target = box.get();
    const callable = this.#implementations.get(target);
    if (callable === undefined) {
      throw new Error(`Trait not implementemented: ${this.name}`);
    }
    return callable(...args);
  }
}

const Clonable = Trait.for('Clonable');
const Movable = Trait.for('Movable');
const Serializable = Trait.for('Serializable');

const createPoint = (x, y) => {
  using point = new Box({ x, y });
  const self = Object.create(null);

  Clonable.implement(self, () => {
    const { x, y } = point.get();
    return createPoint(x, y);
  });

  Movable.implement(self, (d) => {
    const p = point.get();
    return createPoint(p.x + d.x, p.y + d.y);
  });

  Serializable.implement(self, () => {
    const { x, y } = point.get();
    return `(${x}, ${y})`;
  });

  return new Box(self);
};

// Usage

const main = () => {
  using p1 = createPoint(10, 20);
  console.log(Serializable.invoke(p1));
  using c0 = Clonable.invoke(p1);
  console.log(Serializable.invoke(c0));
  using c1 = Movable.invoke(c0, { x: -5, y: 10 });
  console.log(Serializable.invoke(c1));
};

main();
