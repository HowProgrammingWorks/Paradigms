'use strict';
// if we use typescript we could change it to interface or abstract class and then just implement or extends depending on choosed option.
class MoveStrategy {
  move(x, y, dx, dy) {
    throw new Error("Not implemented");
  }
}
// it`s better to implement interface here instead of extending base class
class LinearMove extends MoveStrategy {
  move(x, y, dx, dy) {
    return { x: x + dx, y: y + dy };
  }
}


class Point {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  static createCartesian(x, y) {
    return new Point(x, y);
  }

  static createPolar(r, theta) {
    return new Point(r * Math.cos(theta), r * Math.sin(theta));
  }


  move(x, y) {
    this.#x += x;
    this.#y += y;
  }

  clone() {
    return new Point(this.#x, this.#y);
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());

// Creation of instance using static methods
const p2 = Point.createCartesian(20, 30);
const p3 = Point.createPolar(5, Math.PI * 2);

