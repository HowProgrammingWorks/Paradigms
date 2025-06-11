import * as fs from 'fs';
import * as path from 'path';

interface IPoint {
  x: number;
  y: number;
  clone(): Point;
  move(x: number, y: number): void;
  toString(): string;
}

class Point implements IPoint {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

  move(x: number, y: number): void {
    this.x += x;
    this.y += y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

interface IPointRepository {
  save(point: Point, id: string): void;
  load(id: string): Point | null;
}

class FilePointRepository implements IPointRepository {
  private baseDir: string;
  constructor(baseDir: string = './points') {
    this.baseDir = baseDir;
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  save(point: Point, id: string): void {
    const filePath = path.join(this.baseDir, `${id}.json`);
    const data = JSON.stringify(point);
    fs.writeFileSync(filePath, data, 'utf8');
  }

  load(id: string): Point | null {
    const filePath = path.join(this.baseDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const pointData = JSON.parse(data);

      return new Point(pointData.x, pointData.y);
    } catch (error) {
      console.error(`Error loading point ${id}:`, error);

      return null;
    }
  }
}

const repository = new FilePointRepository();
const p1 = new Point(10, 20);

console.log(p1.toString());
repository.save(p1, 'point1');

const c1 = p1.clone();
c1.move(-5, 10);

console.log(c1.toString());
repository.save(c1, 'point2');

const loadedPoint = repository.load('point1');

console.log(loadedPoint?.toString());
