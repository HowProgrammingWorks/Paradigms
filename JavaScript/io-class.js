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
    return Monad.of(fn(this.#value));
  }

  chain(fn) {
    return fn(this.#value);
  }

  ap(container) {
    return container.map(this.#value);
  }
}

class Point {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  static of(x, y) {
    return new Point(x, y);
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  move(delta) {
    return Point.of(this.#x + delta.x, this.#y + delta.y);
  }

  clone() {
    return Point.of(this.#x, this.#y);
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

// Usage

const readPoint = () => IO.of(() => Point.of(10, 20));
const writeLine = (text) => IO.of(() => console.log(text));

const p1 = readPoint().map(Monad.of).run();
p1.map((point) => point.toString())
  .chain(writeLine)
  .run();
const c0 = p1.map((point) => point.clone());
const t1 = Monad.of((point) => point.move(Point.of(-5, 10)));
const c1 = t1.ap(c0);
c1.map((point) => point.toString())
  .chain(writeLine)
  .run();
