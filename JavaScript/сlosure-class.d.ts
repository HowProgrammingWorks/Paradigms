declare class Point {
  x: number;
  y: number;

  constructor(ax: number, ay: number);

  clone(): Point;
  toString(): string;
  move(dx: number, dy: number): void;
}

export = Point;
