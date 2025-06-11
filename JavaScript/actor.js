'use strict';

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

let EventTargetClass;
if (isNode) {
  const { EventEmitter } = require('events');
  class NodeEventTarget {
    constructor() {
      this.emitter = new EventEmitter();
    }
    addEventListener(event, listener) {
      this.emitter.on(event, listener);
    }
    removeEventListener(event, listener) {
      this.emitter.off(event, listener);
    }
    dispatchEvent(event) {
      this.emitter.emit(event.type, event);
    }
  }
  EventTargetClass = NodeEventTarget;
} else {
  EventTargetClass = EventTarget; 
}

class Point extends EventTargetClass {
  #x;
  #y;

  constructor(x, y) {
    super();
    this.#x = x;
    this.#y = y;
  }

  move(dx, dy) {
    this.#x += dx;
    this.#y += dy;
    this.dispatchEvent(new CustomEvent('updated', { detail: { x: this.#x, y: this.#y } }));
  }

  clone() {
    const clone = new Point(this.#x, this.#y);
    this.dispatchEvent(new CustomEvent('cloned', { detail: clone }));
    return clone;
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

class QueueProcessor {
  #queue = [];
  #processing = false;

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ task, resolve, reject });
      this.#process();
    });
  }

  async #process() {
    if (this.#processing) return;
    this.#processing = true;
    while (this.#queue.length) {
      const { task, resolve, reject } = this.#queue.shift();
      try {
        const result = await task();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }
    this.#processing = false;
  }
}

class PointActor {
  #point;
  #queueProcessor;

  constructor(point) {
    this.#point = point;
    this.#queueProcessor = new QueueProcessor();
  }

  addEventListener(event, listener) {
    this.#point.addEventListener(event, listener);
  }

  removeEventListener(event, listener) {
    this.#point.removeEventListener(event, listener);
  }

  send(message) {
    return this.#queueProcessor.enqueue(() => {
      const { method, args = [] } = message;
      if (typeof this.#point[method] === 'function') {
        return this.#point[method](...args);
      } else {
        throw new Error(`Method "${method}" not found on Point.`);
      }
    });
  }
}


const main = async () => {
  const p = new Point(10, 20);
  const actor = new PointActor(p);

  actor.addEventListener('updated', (e) => {
    const { x, y } = e.detail;
    console.log(`[Observer] Point updated: (${x}, ${y})`);
  });

  actor.addEventListener('cloned', (e) => {
    const clone = e.detail;
    console.log(`[Observer] Point cloned: ${clone.toString()}`);
    const cloneActor = new PointActor(clone);
    cloneActor.addEventListener('updated', (ev) => {
      const { x, y } = ev.detail;
      console.log(`[Observer] Clone updated: (${x}, ${y})`);
    });

    cloneActor.send({ method: 'move', args: [-5, 10] }).then(() => {
      cloneActor.send({ method: 'toString' }).then(console.log);
    });
  });

  console.log(await actor.send({ method: 'toString' })); 
  await actor.send({ method: 'move', args: [5, 5] });    
  console.log(await actor.send({ method: 'toString' })); 

  const clone = await actor.send({ method: 'clone' });    
};

main();
