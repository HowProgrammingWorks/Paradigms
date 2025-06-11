'use strict';

const fs = require('fs').promises;
const path = require('path');

const POINTS = {};
const STORAGE_FILE = path.join(__dirname, 'points.json');

class Point {
  #x;
  #y;
  #id;

  constructor(x, y, id = null) {
    this.#x = x;
    this.#y = y;
    this.#id = id || this.generateId();
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  get x() { return this.#x; }
  get y() { return this.#y; }
  get id() { return this.#id; }

  move(x, y) {
    this.#x += x;
    this.#y += y;
    return this;
  }

  clone() {
    return new Point(this.#x, this.#y);
  }

  toString() {
    return `Point(${this.#x}, ${this.#y}) [ID: ${this.#id}]`;
  }

  async save() {
    const pointData = {
      id: this.#id,
      x: this.#x,
      y: this.#y
    };
    
    POINTS[this.#id] = pointData;
    
    await this.saveToFile();
    
    return this;
  }

  async delete() {
    delete POINTS[this.#id];
    await this.saveToFile();
  }

  static async find(id) {
    await Point.loadFromFile();
    
    const record = POINTS[id];
    if (!record) return null;
    
    return new Point(record.x, record.y, record.id);
  }

  static async findAll() {
    await Point.loadFromFile();
    
    const points = [];
    for (const record of Object.values(POINTS)) {
      points.push(new Point(record.x, record.y, record.id));
    }
    
    return points;
  }

  static async create(x, y) {
    const point = new Point(x, y);
    await point.save();
    return point;
  }

  async saveToFile() {
    try {
      const data = JSON.stringify(POINTS, null, 2);
      await fs.writeFile(STORAGE_FILE, data, 'utf8');
    } catch (error) {
      console.error('Error saving to file:', error.message);
    }
  }

  static async loadFromFile() {
    try {
      const data = await fs.readFile(STORAGE_FILE, 'utf8');
      const points = JSON.parse(data);
      
      Object.assign(POINTS, points);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('Storage file not found, creating new one');
      } else {
        console.error('Error loading from file:', error.message);
      }
    }
  }

  static async clear() {
    Object.keys(POINTS).forEach(key => delete POINTS[key]);
    await Point.prototype.saveToFile.call({ saveToFile: Point.prototype.saveToFile });
  }

}

// Usage
const main = async () => {
  console.log('=== Point ActiveRecord Demo ===\n');

  console.log('1. Creating points...');
  const p1 = await Point.create(10, 20);
  const p2 = await Point.create(30, 40);
  console.log('Created:', p1.toString());
  console.log('Created:', p2.toString());

  console.log('\n2. Moving point p1...');
  p1.move(5, 10);
  await p1.save();
  console.log('Moved and saved:', p1.toString());

  console.log('\n3. Finding point by ID...');
  const foundPoint = await Point.find(p1.id);
  console.log('Found point:', foundPoint ? foundPoint.toString() : 'Not found');

  console.log('\n4. Getting all points...');
  const allPoints = await Point.findAll();
  console.log('All points:');
  allPoints.forEach(point => console.log(' -', point.toString()));

  console.log('\n5. Cloning point...');
  const cloned = foundPoint.clone();
  cloned.move(-5, 10);
  await cloned.save();
  console.log('Cloned and modified:', cloned.toString());

  console.log('\n6. Deleting point...');
  await p2.delete();
  console.log('Point p2 deleted');

  console.log('\n7. Remaining points:');
  const remaining = await Point.findAll();
  remaining.forEach(point => console.log(' -', point.toString()));

  console.log('\n=== Demo completed ===');
  console.log(`Data persisted in: ${STORAGE_FILE}`);
};

module.exports = { Point };

if (require.main === module) {
  main().catch(console.error);
}