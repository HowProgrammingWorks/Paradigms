'use strict';
export {};

class Effect<T> {
  private readonly command: () => T;

  private constructor(command: () => T) {
    this.command = command;
  }

  static from<T>(command: () => T): Effect<T> {
    return new Effect(command);
  }

  transform<U>(fn: (value: T) => U): Effect<U> {
    return new Effect(() => fn(this.command()));
  }

  chain<U>(fn: (value: T) => Effect<U>): Effect<U> {
    return new Effect(() => fn(this.command()).execute());
  }

  execute(): T {
    return this.command();
  }
}

class ValueBox<T> {
  private readonly value: T;

  private constructor(value: T) {
    this.value = value;
  }

  static from<T>(value: T): ValueBox<T> {
    return new ValueBox(value);
  }

  transform<U>(fn: (v: T) => U): ValueBox<U> {
    return new ValueBox(fn(this.clone()));
  }

  chain<R>(fn: (v: T) => R): R {
    return fn(this.clone());
  }

  apply<A, B>(this: ValueBox<(arg: A) => B>, other: ValueBox<A>): ValueBox<B> {
    return other.transform(this.value);
  }

  unwrap(): T {
    return this.clone();
  }

  private clone(): T {
    return structuredClone(this.value);
  }
}

interface Point {
  x: number;
  y: number;
}

const move =
  (d: Point) =>
  (p: Point): Point => ({ x: p.x + d.x, y: p.y + d.y });
const clone = ({ x, y }: Point): Point => ({ x, y });
const toString = ({ x, y }: Point) => Effect.from(() => `(${x}, ${y})`);

// Usage

const start = Effect.from(() => ValueBox.from<Point>({ x: 10, y: 20 }));

start
  .chain((box) => box.chain(toString))
  .transform(console.log)
  .execute();
const c0 = start.chain((b) => Effect.from(() => b.transform(clone)));

const c1 = c0.chain((b) =>
  Effect.from(() => ValueBox.from(move({ x: -5, y: 10 })).apply(b)),
);

c1.chain((b) => b.chain(toString))
  .transform(console.log)
  .execute();
