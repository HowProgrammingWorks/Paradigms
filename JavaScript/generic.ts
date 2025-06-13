type Coords = { x: number; y: number };

function addVectors<T extends Record<string, number>>(a: T, b: T): T {
  const result = {} as T;
  for (const key of Object.keys(a) as Array<keyof T>) {
    result[key] = (a[key] + b[key]) as T[typeof key];
  }
  return result;
}

class Point<T extends Record<string, number>> {
  #coords: T;

  constructor(coords: T) {
    this.#coords = coords;
  }

  move(delta: T): void {
    this.#coords = addVectors(this.#coords, delta);
  }

  clone(): Point<T> {
    return new Point({ ...this.#coords });
  }

  toString(): string {
    return `(${Object.values(this.#coords).join(', ')})`;
  }
}

// Usage

const p1 = new Point<Coords>({ x: 10, y: 20 });
console.log(p1.toString());
p1.move({ x: -5, y: 10 });
console.log(p1.toString());
