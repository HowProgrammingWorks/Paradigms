'use strict';
export {};

class IO<T> {
  private readonly effect: () => T;

  private constructor(effect: () => T) {
    this.effect = effect;
  }

  static of<T>(effect: () => T): IO<T> {
    return new IO(effect);
  }

  map<U>(fn: (value: T) => U): IO<U> {
    return new IO(() => fn(this.effect()));
  }

  chain<U>(fn: (value: T) => IO<U>): IO<U> {
    return new IO(() => fn(this.effect()).run());
  }

  run(): T {
    return this.effect();
  }
}

class Monad<T> {
  private readonly value: T;

  private constructor(value: T) {
    this.value = value;
  }

  static of<T>(value: T): Monad<T> {
    return new Monad(value);
  }

  map<U>(fn: (value: T) => U): Monad<U> {
    const v = structuredClone(this.value) as T;
    return Monad.of(fn(v));
  }

  chain<R>(fn: (value: T) => R): R {
    const v = structuredClone(this.value) as T;
    return fn(v);
  }

  ap<A, B>(this: Monad<(arg: A) => B>, container: Monad<A>): Monad<B> {
    return container.map(this.value);
  }
}

type Point = { x: number; y: number };

const move =
  (d: Point) =>
  (p: Point): Point => ({ x: p.x + d.x, y: p.y + d.y });

const clone = ({ x, y }: Point): Point => ({ x, y });

const toString = ({ x, y }: Point): IO<string> => IO.of(() => `(${x}, ${y})`);

// Usage

const input = IO.of(() => Monad.of<Point>({ x: 10, y: 20 }));

input
  .chain((monad) => monad.chain(toString))
  .map(console.log)
  .run();

const c0 = input.chain((m) => IO.of(() => m.map(clone)));
const c1 = c0.chain((m) => IO.of(() => Monad.of(move({ x: -5, y: 10 })).ap(m)));

c1.chain((m) => m.chain(toString))
  .map(console.log)
  .run();
