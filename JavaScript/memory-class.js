'use strict';

const PointValidator = require('../Utils/point-validator');

class Point {
  static BUFFER_SIZE = 8;
  #coordinates;
  #xIndex = 0;
  #yIndex = 1;
  #initialXCoordinates = 0;
  #initialYCoordinates = 0;

  constructor(initialX, initialY, sharedCoordinates = null) {
    PointValidator.validateCoordinates(initialX, initialY);
    const buffer = new SharedArrayBuffer(Point.BUFFER_SIZE);
    this.#coordinates = new Int32Array(buffer);
    if (sharedCoordinates) {
      this.#coordinates.set(sharedCoordinates);
    } else {
      this.#coordinates[this.#xIndex] = initialX;
      this.#coordinates[this.#yIndex] = initialY;
    }
  }

  move(deltaX, deltaY) {
    PointValidator.validateCoordinates(deltaX, deltaY);
    Atomics.add(this.#coordinates, this.#xIndex, deltaX);
    Atomics.add(this.#coordinates, this.#yIndex, deltaY);
  }

  clone() {
    return new Point(this.#initialXCoordinates, this.#initialYCoordinates, this.#coordinates);
  }

  toString() {
    const x = Atomics.load(this.#coordinates, this.#xIndex);
    const y = Atomics.load(this.#coordinates, this.#yIndex);
    return `(${x}, ${y})`;
  }
}

// Usage

const p1 = new Point(10, 20);
console.log(p1.toString());
const c1 = p1.clone();
c1.move(-5, 10);
console.log(c1.toString());
