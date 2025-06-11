'use strict';

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

class Observable {
  constructor() {
    if (isNode) {
      const { EventEmitter } = require('events');
      this._emitter = new EventEmitter();
    } else {
      this._emitter = document.createDocumentFragment();
    }
  }

  addEventListener(event, listener) {
    if (isNode) {
      this._emitter.on(event, listener);
    } else {
      this._emitter.addEventListener(event, listener);
    }
  }

  removeEventListener(event, listener) {
    if (isNode) {
      this._emitter.off(event, listener);
    } else {
      this._emitter.removeEventListener(event, listener);
    }
  }

  dispatchEvent(event) {
    if (isNode) {
      this._emitter.emit(event.type, event);
    } else {
      this._emitter.dispatchEvent(event);
    }
  }
}

class Point {
  #x;
  #y;
  #observable;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
    this.#observable = new Observable();
  }

  addEventListener(event, listener) {
    this.#observable.addEventListener(event, listener);
  }

  removeEventListener(event, listener) {
    this.#observable.removeEventListener(event, listener);
  }

  move(dx, dy) {
    this.#x += dx;
    this.#y += dy;
    this.#observable.dispatchEvent(new CustomEvent('moved', {
      detail: { x: this.#x, y: this.#y }
    }));
  }

  clone() {
    const cloned = new Point(this.#x, this.#y);
    this.#observable.dispatchEvent(new CustomEvent('cloned', {
      detail: cloned
    }));
    return cloned;
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

const p1 = new Point(10, 20);

p1.addEventListener('moved', e => {
  const { x, y } = e.detail;
  console.log(`[Observer] Point moved to (${x}, ${y})`);
});

p1.addEventListener('cloned', e => {
  const clone = e.detail;
  console.log(`[Observer] Point cloned: ${clone.toString()}`);
});

console.log(p1.toString());  
p1.move(5, 5);               
const c1 = p1.clone();       
console.log(c1.toString());  
c1.move(-5, 10);             
