type Coords = Record<string, number>;
type Coords2d = { x: number; y: number };

const validatePoint = <T extends Coords>(coords: T): Error[] => {
  const errors: Error[] = [];
  if (typeof coords === 'object' && coords !== null) {
    for (const [key, value] of Object.entries(coords)) {
      if (typeof value === 'number' && !Number.isFinite(value)) {
        errors.push(new TypeError(`Invalid ${key}: ${value}`));
      }
    }
  }
  return errors;
};

function addVectors<T extends Coords>(a: T, b: T): T {
  const result = {} as T;
  for (const key of Object.keys(a) as Array<keyof T>) {
    result[key] = (a[key] + b[key]) as T[typeof key];
  }
  return result;
}

class Point<T extends Coords> {
  #coords: T;

  constructor(coords: T) {
    const errors = validatePoint(coords);
    if (errors.length > 0) {
      const cause = new AggregateError(errors, 'Validation');
      throw new RangeError('Bad coordinates', { cause });
    }
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

const p1 = new Point<Coords2d>({ x: 10, y: 20 });
console.log(p1.toString());
p1.move({ x: -5, y: 10 });
console.log(p1.toString());
