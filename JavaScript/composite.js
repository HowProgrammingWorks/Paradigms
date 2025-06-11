/*@stas_yukhymenko Створи по аналогії з Point абстракії для лінії та ламаної 
https://github.com/HowProgrammingWorks/Paradigms 
з використанням патерну Composite: https://github.com/HowProgrammingWorks/Composite
*/

class Point {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  move(dx, dy) {
    this.#x += dx;
    this.#y += dy;
  }

  clone() {
    return new Point(this.#x, this.#y);
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('Cannot instantiate abstract Shape');
    }
  }

  move(dx, dy) {
    throw new Error('move() must be implemented');
  }

  clone() {
    throw new Error('clone() must be implemented');
  }

  toString() {
    throw new Error('toString() must be implemented');
  }
}

class Polyline extends Shape {
  #name;
  #components = [];

  constructor(name) {
    super();
    this.#name = name;
  }

  add(component) {
    if (!(component instanceof Point || component instanceof Shape)) {
      throw new Error('Component must be a Point or Shape');
    }
    this.#components.push(component);
  }

  remove(component) {
    const index = this.#components.indexOf(component);
    if (index !== -1) {
      this.#components.splice(index, 1);
    }
  }

  move(dx, dy) {
    this.#components.forEach(c => c.move(dx, dy));
  }

  clone() {
    const copy = new Polyline(this.#name);
    this.#components.forEach(c => copy.add(c.clone()));
    return copy;
  }

  toString() {
    const parts = this.#components.map(c => c.toString()).join(' -> ');
    return `[Polyline "${this.#name}": ${parts}]`;
  }
}

class Line {
  #start;
  #end;

  constructor(start, end) {
    if (!(start instanceof Point && end instanceof Point)) {
      throw new Error('Line requires two Points');
    }
    this.#start = start;
    this.#end = end;
  }

  move(dx, dy) {
    this.#start.move(dx, dy);
    this.#end.move(dx, dy);
  }

  clone() {
    return new Line(this.#start.clone(), this.#end.clone());
  }

  toString() {
    return `[Line: ${this.#start.toString()} -> ${this.#end.toString()}]`;
  }
}


// Usage

const a = new Point(1, 2);
const b = new Point(3, 4);
const c = new Point(5, 6);

const line = new Line(a, b);
console.log(line.toString());

const route = new Polyline('Route');
route.add(a);
route.add(b);
route.add(c);
console.log(route.toString());

const movedRoute = route.clone();
movedRoute.move(-1, -2);
console.log(movedRoute.toString());
