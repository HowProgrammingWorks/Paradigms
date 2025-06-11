/*@stas_yukhymenko Створи по аналогії з Point абстракії для лінії та ламаної 
https://github.com/HowProgrammingWorks/Paradigms 
з використанням патерну Composite: https://github.com/HowProgrammingWorks/Composite
*/

class AbstractShape {
  constructor() {
    if (new.target === AbstractShape) {
      throw new Error('Cannot instantiate AbstractShape directly');
    }
  }

  move(dx, dy) {
    throw new Error('Method move() must be implemented');
  }

  clone() {
    throw new Error('Method clone() must be implemented');
  }

  toString() {
    throw new Error('Method toString() must be implemented');
  }
}

class PointShape extends AbstractShape {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  clone() {
    return new PointShape(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

class LineShape extends AbstractShape {
  constructor(startPoint, endPoint) {
    super();
    this.start = startPoint;
    this.end = endPoint;
  }

  move(dx, dy) {
    this.start.move(dx, dy);
    this.end.move(dx, dy);
  }

  clone() {
    return new LineShape(this.start.clone(), this.end.clone());
  }

  toString() {
    return `[Line: ${this.start.toString()} -> ${this.end.toString()}]`;
  }
}

class PolylineShape extends AbstractShape {
  constructor(name, ...points) {
    super();
    this.name = name;
    this.points = points;
  }

  move(dx, dy) {
    this.points.forEach(pt => pt.move(dx, dy));
  }

  clone() {
    return new PolylineShape(
      this.name,
      ...this.points.map(pt => pt.clone())
    );
  }

  toString() {
    const pts = this.points.map(pt => pt.toString()).join(' -> ');
    return `[Polyline "${this.name}": ${pts}]`;
  }
}

// Usage

(async () => {
  const a = new PointShape(1, 2);
  const b = new PointShape(3, 4);
  const c = new PointShape(5, 6);

  const line2 = new LineShape(a, b);
  console.log(line2.toString());

  const poly2 = new PolylineShape('Route', a, b, c);
  console.log(poly2.toString());

  const moved = poly2.clone();
  moved.move(-1, -2);
  console.log(moved.toString());
})();
