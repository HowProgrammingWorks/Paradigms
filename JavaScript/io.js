'use strict';

class IO {
  #effect;

  constructor(effect) {
    this.#effect = effect;
  }

  static of(effect) {
    return new IO(effect);
  }

  map(fn) {
    return new IO(() => fn(this.#effect()));
  }

  chain(fn) {
    return new IO(() => fn(this.#effect()).run());
  }

  run() {
    return this.#effect();
  }
}

class Monad {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static of(value) {
    return new Monad(value);
  }

  map(fn) {
    const v = structuredClone(this.#value);
    return Monad.of(fn(v));
  }

  chain(fn) {
    const v = structuredClone(this.#value);
    return fn(v);
  }

  ap(container) {
    return container.map(this.#value);
  }
}

const move = (d) => ({ x, y }) => ({ x: x + d.x, y: y + d.y });
const clone = ({ x, y }) => ({ x, y });
const toString = ({ x, y }) => IO.of(() => `(${x}, ${y})`);

// Usage

const input = IO.of(() => Monad.of({ x: 10, y: 20 }));

input
  .chain((monad) => monad.chain(toString))
  .map(console.log)
  .run();

const c0 = input.chain((monad) => IO.of(() => monad.map(clone)));
const c1 = c0.chain((monad) =>
  IO.of(() => Monad.of(move({ x: -5, y: 10 })).ap(monad)),
);

c1.chain((monad) => monad.chain(toString))
  .map(console.log)
  .run();
