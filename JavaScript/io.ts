'use strict';

type Effect<T> = () => T;

class IOTypeScript<T> {
  #effect: Effect<T>;

  constructor(effect: Effect<T>) {
    this.#effect = effect;
  }

  static of<T>(effect: Effect<T>): IOTypeScript<T> {
    return new IOTypeScript(effect);
  }

  map<U>(fn: (value: T) => U): IOTypeScript<U> {
    return new IOTypeScript(() => fn(this.#effect()));
  }

  chain<U>(fn: (value: T) => IOTypeScript<U>): IOTypeScript<U> {
    return new IOTypeScript(() => fn(this.#effect()).run());
  }

  run(): T {
    return this.#effect();
  }
}

class Monad<T> {
  #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  static of<T>(value: T): Monad<T> {
    return new Monad(value);
  }

  map<U>(fn: (value: T) => U): Monad<U> {
    const v = structuredClone(this.#value);
    return Monad.of(fn(v));
  }

  chain<U>(fn: (value: T) => U): U {
    const v = structuredClone(this.#value);
    return fn(v);
  }

  ap<U>(container: Monad<(value: T) => U>): Monad<U> {
    return container.map(fn => fn(this.#value));
  }
}

type PointTS = { x: number; y: number };

const moveTS = (d: PointTS) => (p: PointTS): PointTS => ({
  x: p.x + d.x,
  y: p.y + d.y,
});

const cloneTS = (p: PointTS): PointTS => ({ x: p.x, y: p.y });

const toStringTS = (p: PointTS): IOTypeScript<string> =>
  IOTypeScript.of(() => `(${p.x}, ${p.y})`);


const inputTS: IOTypeScript<Monad<PointTS>> =
  IOTypeScript.of(() => Monad.of({ x: 10, y: 20 }));

inputTS
  .chain((monad) =>
    monad.chain(toStringTS)
  )
  .map(console.log)
  .run();

const c0TS: IOTypeScript<Monad<PointTS>> = inputTS.chain((monad) =>
  IOTypeScript.of(() => monad.map(cloneTS))
);

const c1TS: IOTypeScript<Monad<PointTS>> = c0TS.chain((monad) =>
  IOTypeScript.of(() =>
    monad.ap(Monad.of(moveTS({ x: -5, y: 10 })))
  )
);

c1TS
  .chain((monad) => monad.chain(toStringTS))
  .map(console.log)
  .run();
