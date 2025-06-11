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

class CircularMove extends MoveStrategy {
  move(x, y, angleRadians) {
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }
}


class Point {
  #x;
  #y;
  #strategy

  constructor(x, y, strategy = new LinearMove()) {
    this.#x = x;
    this.#y = y;
    this.#strategy = strategy;
  }

  static createCartesian(x, y, strategy = new LinearMove()) {
    return new Point(x, y, strategy);
  }

  static createPolar(r, theta, strategy = new LinearMove()) {
    return new Point(r * Math.cos(theta), r * Math.sin(theta), strategy);
  }


  move(...args) {
    const {x, y} = this.#strategy.move(this.#x, this.#y, ...args);
    this.#x = x;
    this.#y = y;
    return this;  // Something relative to builder pattern if we use it together with clone method
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

// Ecample of Factory pattern. Creation of instance using static methods
const p2 = Point.createCartesian(20, 30, new CircularMove());
// example of using Strategy pattern
console.log(p2.move(4).toString());

const p3 = Point.createPolar(5, Math.PI * 2);


// Example of Builder pattern

const p4 = p2.move(17,18).move(60, 20).clone();





