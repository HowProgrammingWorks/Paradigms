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
    return IO.of(() => fn(this.run()));
  }

  chain(fn) {
    return fn(this.run());
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
const toString = ({ x, y }) => `(${x}, ${y})`;

// Usage

const readPoint = () => IO.of(() => ({ x: 10, y: 20 }));
const writeLine = (text) => IO.of(() => console.log(text));

const p1 = readPoint().map(Monad.of).run();
p1.map(toString).chain(writeLine).run();
const c0 = p1.map(clone);
const t1 = Monad.of(move({ x: -5, y: 10 }));
const c1 = t1.ap(c0);
c1.map(toString).chain(writeLine).run();
