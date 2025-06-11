'use strict';

interface Coordinates {
  x: number;
  y: number;
}

type TransformFunction = (x: number, y: number) => Coordinates;

class Point {
  private readonly x: number;
  private readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static of(x: number, y: number): Point {
    return new Point(x, y);
  }

  map(fn: TransformFunction): Point {
    const { x, y } = fn(this.x, this.y);
    return Point.of(x, y);
  }

  chain<T>(fn: (x: number, y: number) => T): T {
    return fn(this.x, this.y);
  }
}

class PointTransform {
  private readonly fn: TransformFunction;

  constructor(fn: TransformFunction) {
    this.fn = fn;
  }

  ap(point: Point): Point {
    return point.map(this.fn);
  }
}

class Serialized {
  private readonly data: string;

  constructor(data: string) {
    this.data = data;
  }

  map(fn: (data: string) => void): Serialized {
    fn(this.data);
    return this;
  }
}

const move = (dx: number, dy: number): TransformFunction =>
  (x: number, y: number): Coordinates => ({ x: x + dx, y: y + dy });

const clone: TransformFunction = (x: number, y: number): Coordinates => ({ x, y });

const toStringPoint = (x: number, y: number): Serialized =>
  new Serialized(`(${x}, ${y})`);

// Usage
const p1: Point = Point.of(10, 20);
p1.chain(toStringPoint).map(console.log);

const c0: Point = p1.map(clone);
const t1: PointTransform = new PointTransform(move(-5, 10));
const c1: Point = t1.ap(c0);
c1.chain(toStringPoint).map(console.log);
