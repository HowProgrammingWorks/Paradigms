# Programming Paradigms Comparison


## Paradigms

* Imperative Programming
  + Characteristics: statements mutate program state directly (let, loops, assignments)
  + Architecture Influence: stateful services, command-driven architecture
* Procedural Programming
  + Characteristics: step-by-step, linear control flow, mutable state
  + Architecture Influence: transaction script, single responsibility units, shallow call graphs
* Object-Oriented Programming
  + Characteristics: classes/objects, encapsulation, inheritance, polymorphism
  + Architecture Influence: DDD, layered architecture, clean architecture, hexagonal
* Prototype-based Programming
  + Characteristics: objects inherit from other objects, delegation over inheritance
  + Architecture Influence: flexible object composition, dynamic plugin systems
* Functional Programming
  + Characteristics: pure functions, immutability, no shared state, higher-order functions, pattern matching, curry, single argument functions, composition
  + Architecture Influence: functional pipelines, stateless services, async stream processing
* Closure-based Programming
  + Characteristics: functions hold private state via closures, encapsulated behavior
  + Architecture Influence: lightweight encapsulation, reactive units, factory patterns
* Actor Model
  + Characteristics: message passing, no shared memory, isolated context, transparent concurrency units
  + Architecture Influence: distributed systems, concurrency-safe services, microservices
* Structural Programming
  + Blocks, No goto
* Declarative Programming
  + Characteristics: emphasizes what over how, side-effect free, high-level code, DSLs, self-descriptive
  + Architecture Influence: configuration-over-code, rule engines
* Contract programming
  + Characteristics: difine contracts
  + Architecture Influence: stable and clear, self-descriptive
* Reactive Programming
  + Characteristics: observable streams, event-driven, push-based, backpressure-aware
  + Architecture Influence: UIs, data stream processing, feedback loops, real-time pipelines
* Finite-State Machines / Automata
  + Characteristics: explicit states, transitions, events, deterministic flow
  + Architecture Influence: workflow engines
* Metaprogramming
  + Characteristics: code generation, reflection, macros, introspection
  + Architecture Influence: high flexibility, scaffolding

## Basic Ideas
  
1. Control Flow
  - Statements, algorithm steps
    ```js
    const user = read({ id: 15 });
    if (user.name === 'marcus') {
      console.log(user.age);
    }
    ```
  - Expression
    ```js
    ({ id }) => (fn) => fn({ id, name: 'marcus', age: 42 })
      ({ id: 15 })(({ name, age }) => name === 'marcus' ? (log) => log(age) : () => {})
        (console.log);
    ```
  - Do-notation
    ```js
    Do({ id: 15 })
      .chain(({ id }) => ({ id, name: 'marcus', age: 42 }))
      .chain(({ name, age }) => name === 'marcus' ? (log) => log(age) : () => {})
      .run()(console.log);
    ```
  - Declarative style
    ```js
    execute({
      read: { id: 15 },
      then: {
        match: { name: 'marcus' },
        success: { effect: { log: 'age' } },
        fail: { effect: 'noop' },
      },
    })(reader, console.log)();
    ```
  - Pipeline operator
    ```js
    (({ id: 15 })
      |> read
      |> (({ name, age }) => name === 'marcus' ? (log) => log(age) : () => {})
    )(console.log);
    ```
  - Pipe (composition)
    ```js
    pipe(
      { id: 15 },
      read,
      ({ name, age }) => name === 'marcus' ? (log) => log(age) : () => {}
    )(console.log);
    ```
2. Identifiers
  - Assignment statement
    ```js
    let a = 10; const b = 20; a = a + b;
    ```
  - Call arguments
    ```js
    ((a, b) => a + b)(5, 3);
    ```
  - Only callable
    ```js
    const a = () => 10;
    const b = () => 20;
    const sum = (x, y) => () => x() + y();
    const c = sum(a, b);
    ```
3. State
  - Mutable state and form
    ```js
    const counter = { value: 0 };
    counter.value += 1;
    ```
  - Mutable form
    ```js
    counter.ready = true;
    ```
  - Immutable state
    ```js
    const point = Object.freeze({ x: 10, y: 20 });
    const move = (p) => ({ x, y }) => ({ x: p.x + x, y: p.y + y });
    const moved = move(point)({ x: 3, y: 7 });
    ```
  - Copy-on-write
    ```js
    const p1 = { x: 10, y: 20 };
    const p2 = Object.create(p1);
    p2.x = 7;
    ```
  - Stateless functions
    ```js
    const twice = (x) => x * 2;
    ```
4. Context
  - Objects
    ```js
    const point = { x: 10, y: 20, move(dx, dy) { this.x += dx; this.y += dy; } };
    ```
  - Records
    ```js
    const point = { x: 10, y: 20 };
    const move = (p, d) => { p.x += d.x; p.y += d.y; };
    ```
  - Closures
    ```js
    const createCounter = (count = 0) => () => ++count;
    ```
  - Boxing
    ```js
    const primitive = 42;
    const instance = new Number(42);
    const boxed = Box.of(42);
    ```
  - Containers
    ```js
    Box.of(42); Either.right(42); Promise.resolve(42);
    let maybe: number | null = 42; type Pair = { a?: number; b?: number };
    type Option<T> = { kind: 'some'; value: T } | { kind: 'none' };
    std::optional<int>; std::tuple<int>; std::reference_wrapper<int>;
    Nullable<int> maybe = 42; new StrongBox<int>(value); Tuple.Create(myIntValue);
    ```
  - Modules
    ```ts
    const cache = new Map();
    export const get = (key) => cache.get(key);
    export const set = (key, value) => cache.set(key, value);
    ```
5. Branching
  - Conditional statement
    ```js
    if (x > 0) {
      console.log('positive');
    } else if (x < 0) {
      console.log('negative');
    } else {
      console.log('zero');
    }
    ```
  - Conditional expression
    ```js
    const sign = x > 0 ? 'positive' : x < 0 ? 'negative' : 'zero';
    ```
  - Guards
    ```js
    const process = (x) => {
      if (x === null) return null;
      if (x < 0) return null;
      return x * 2;
    };
    ```
    ```swift
    func process(_ x: Int?) -> Int? {
      guard let v = x else { return nil }
      guard v >= 0 else { return nil }
      return v * 2
    }
    ```
  - Pattern matching
    ```rs
    fn process(x: Option<i32>) -> Option<i32> {
      match x {
        None => None,
        Some(v) if v < 0 => None,
        Some(v) => Some(v * 2),
      }
    }
    ```
    ```js
    const match = (variant, handlers) => handlers[variant.tag](variant);
    match({ tag: 'point', x: 10, y: 20 }, {
      point: ({ x, y }) => `(${x}, ${y})`,
      circle: ({ r }) => `radius: ${r}`
    });
    ```
6. Iteration
  - Loops (for, while, do)
    ```js
    for (let i = 0; i < 10; i++) console.log(i);
    while (condition) { /* steps */ }
    do { /* steps */ } while (condition);
    ```
  - Recursion calls (incl. tail recursion)
    ```js
    const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
    const tailFact = (n, acc = 1) => n <= 1 ? acc : tailFact(n - 1, n * acc);
    ```
  - Iterators / Generators
    ```js
    function* range(start, end) {
      for (let i = start; i < end; i++) yield i;
    }
    for (const n of range(0, 5)) console.log(n);
    ```
  - Streams
    ```js
    const res = await fetch('/api/endpoint');
    for await (const chunk of res.body) console.log(new TextDecoder().decode(chunk));
    ```
    For Node.js
    ```js
    const r = Readable.from(gen());
    ```
7. Instantiation
  - Operator `new`
    ```js
    const point = new Point(10, 20);
    ```
  - Creational patterns like Factory, Builder
    ```js
    const p = Point.create(10, 20);
    const q = await Query.select('cities').where({ country: 10 }).order('population');
    ```
  - Closures
    ```js
    const p = createPoint(10, 20);
    const q = await select('cities').where({ country: 10 }).order('population');
    ```
  - Containers
    ```ts
    class Maybe<T = unknown> {
      constructor(value?: T);
      get value(): T | undefined;
      isEmpty(): boolean;
      match<R>(
        some: (value: T) => R,
        none: () => R
      ): R;
    }
    ```
  - Cloning
    ```js
    const clone1 = { ...original };
    const clone2 = Object.assign({}, original);
    const clone3 = structuredClone(original);
    ```
  - Pattern GOF:Flyweight
8. Inheritance
  - Classes
    ```ts
    class SavingAccount extends Account
    ```
  - Interfaces (`implements`)
    ```js
    class Cursor implements Iterator<Account>
    ```
  - Prototype programming
    ```js
    const logger = Object.create(console, { log: { value: (s) => process.write(s) } });
    ```
  - Mixins
    ```js
    const logger = {};
    logger.log = console.log;
    Object.assign(logger, { info: () => {} });
    ```
  - Structural composition
    ```js
    class Logger {
      constructor(name) {
        this.stream = fs.createWriteStream(name);
      }
    }
    ```
  - Partial/Curry
    ```js
    const add = (a, b) => a + b;
    { const add5 = (b) => add(5, b); }
    const curriedAdd = (a) => (b) => a + b;
    { const add5 = curriedAdd(5); }
    { const add5 = add.bind(add, null, 5); }
    ```
  - Traits
    ```rs
    pub trait ToJson {
      fn to_json(&self) -> String;
    }

    pub struct User {
      pub id: u32,
      pub name: String,
    }

    impl ToJson for User {
      fn to_json(&self) -> String {
        format!(r#"{{"id":{},"name":"{}"}}"#, self.id, self.name)
      }
    }
    ```
    TypeScript alternative
    ```ts
    interface ToJson {
      toJson: () => string
    }

    class User implements ToJson {
      readonly id: number
      readonly name: string

      constructor(id: number, name: string) {
        this.id = id
        this.name = name
      }

      toJson = (): string => {
        return `{"id":${this.id},"name":"${this.name}"}`
      }
    }
    ```
9. Primitive values
  - Scalars
    ```js
    const number = 42;
    ```
  - Boxing
    ```js
    const number = 42;
    const boxed = Object(number);
    const unboxed = Number(boxed);
    ```
  - Value Objects
    ```ts
    class Integer {
      private readonly value: number;
      // implement constructor and math operations
    }
    const a = new Integer(7);
    const b = new Integer(3);
    const c = a.add(b);
    ```
  - Containers
10. Asynchronity
  - Callback
    ```js
    const fetchData = (callback) => setTimeout(() => callback('data'), 100);
    fetchData((result) => console.log(result));
    ```
  - Promise
    ```js
    const fetchData = () => Promise.resolve('data');
    fetchData().then((result) => console.log(result));
    ```
  - Async/await
    ```js
    const data = await fetchData();
    ```
  - Future, Task
    ```js
    const fs = require('node:fs');
    const futurify = (fn) => (...args) => new Future((reject, resolve) =>
      fn(...args, (error, result) => error ? reject(error) : resolve(result)),
    );
    const readFuture = futurify(fs.readFile);
    const writeFuture = futurify(fs.writeFile);

    readFuture('future.js', 'utf8')
      .map((text) => text.toUpperCase())
      .chain((text) => writeFuture('future.md', text))
      .fork(
        (error) => console.error('FS error:', error),
        () => console.log('Done'),
      );
    ```
  - Async compose
    ```js
    const prepareReport = pipe(read, parse, calculate, render);
    const checks = parallel(checkBalance, checkAvailability, checkFraud);
    ```
  - Observer (EventEmitter, EventTarget, Signal)
  - Streams and other abstractions
11. Purity
  - Pure functions
    ```js
    const add = (a, b) => a + b;
    const square = (x) => x * x;
    ```
  - Functions with side effects
    ```js
    let counter = 0;
    const increment = () => ++counter;
    ```
  - IO monads
12. First-class citizens
  - Higher-order functions
  - Passing behaviour as object
13. Evaluation Flow
  - Function composition
  - Nested calls
  - Pipeline `|>`
    ```js
    const result = input
      |> validate
      |> transform
      |> process;
    ```
14. Point style
  - Point-free style: `const f = compose(g, h)`
  - Point style: `const f = (x) => g(h(x))`
15. Dependencies
  - Pass all dependencies as arguments
    ```js
    const createService = (db, logger) => { /* implementation */ };
    ```
  - Dependency injection
    ```js
    class Service {
      constructor(db, logger) {
        this.db = db;
        this.logger = logger;
      }
    }
    ```
  - Global namespaces
    ```js
    const user = application.auth.getUser('marcus');
    ```
  - Service locators
    ```js
    const ServiceLocator = {
      services: {},
      register(name, service) { this.services[name] = service; },
      get(name) { return this.services[name]; }
    };
    ```
  - Module systems
16. Structural Control (see Branching)
  - Nested `if/else` conditionals
    ```js
    if (x > 0) {
      if (x > 10) {
        console.log('large');
      } else {
        console.log('small');
      }
    } else {
      console.log('negative');
    }
    ```
  - Pattern matching
  - Guards
17. Error handling
  - Total functions
    ```js
    const safeDivide = (a, b) =>  a / b;
    ```
  - Throwing exceptions
    ```js
    const divide = (a, b) => {
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    };
    ```
  - Error codes
  - Return `null`, `undefined`, `NaN`
  - Null objects
    ```js
    const nullUser = {
      name: 'Guest',
      isAuthenticated: false,
      login: () => {}
    };
    const user = getUser() ?? nullUser;
    ```
  - Option / Either / Result / Promise
    ```js
    class Either<L = unknown, R = unknown> {
      constructor(params: { left?: L | null; right?: R | null });
      static left<L>(value: L): Either<L, null>;
      static right<R>(value: R): Either<null, R>;
      get left(): L | null;
      get right(): R | null;
      isLeft(): boolean;
      isRight(): boolean;
      map<U>(fn: (value: R) => U): Either<L, U>;
      match<T>(
        leftFn: (left: L) => T,
        rightFn: (right: R) => T
      ): T;
    }
    ```
18. Stability of Effects
  - Idempotent operations `new Set().add(3).add(3)`
  - Order-sensitive operations `((a) => (a.push(3), a.push(7), a))([])`
  - Commutative / associative operations `add(a, b) === add(b, a)`
19. Semantic Transparency
  - Non-Referential transparent
    ```js
    class Counter {
      #value = 0;
      inc = () => (++this.#value);
    }
    ```
  - Referential transparency
    ```js
    class Counter {
      #value;
      constructor(value = 0) { this.#value = value; }
      inc = () => new Counter(this.#value + 1);
      value = () => this.#value;
    }
    ```
  - Equational reasoning
    ```js
    const f = (x) => x * 2;
    const g = (x) => x + 1;
    // f(g(x)) === (x + 1) * 2 === 2x + 2
    // Can reason about code as equations
    ```
  - Deterministic evaluation
    ```js
    const pure = (x) => x * 2;
    const impure = () => Math.random();
    ```
  - No hidden state
20. Caching
  - Hash-table caching
    ```js
    const cache = new Map();
    const get = (key) => cache.get(key);
    const set = (key, value) => cache.set(key, value);
    ```
  - Memoization
    ```js
    const fib = memoize((n) => n <= 1 ? n : fib(n - 1) + fib(n - 2));
    ```
21. Resource Control
  - Manual destruction
    ```js
    class Resource {
      constructor() { this.handle = acquire(); }
      dispose() { release(this.handle); }
    }
    const resource = new Resource();
    try {
      // use resource
    } finally {
      resource.dispose();
    }
    ```
  - RAII / disposables
    ```js
    const using = (resource, fn) => {
      try {
        return fn(resource);
      } finally {
        resource.dispose();
      }
    };
    ```
    New JavaScript Disposables: `Symbol.dispose`, `Symbol.asyncDispose`
    ```js
    const main = async () => {
      await using logger = await new Logger('output.log');
      await logger.log('Open');
      await logger.log('Do something');
    };
    ```
  - Region-based allocation
    ```js
    const withRegion = (fn) => {
      const region = [];
      try {
        return fn(region);
      } finally {
        region.forEach(cleanup);
      }
    };
    ```
  - Ownership allocate/free
22. Concurrency Model
  - Shared-memory concurrency
  - Stateless functions
  - Message passing (Actor model)
  - Transactional memory
  - Locking, Semaphor, Mutex
23. Data Ownership
  - Copy semantics
  - Move semantics
  - Shared vs exclusive references
24. Granularity
  - One-liners
  - Long code blocks
  - Moderate granularity

## Memes

```js
const getTomorrowDate = () => {
  const timeout = 86400000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Date());
    }, timeout)
  });
};
```

```js
const Coin = (v) => ({
  map: (f) => Coin(f(v))
});

const flip = () =>
  crypto.getRandomValues(new Uint8Array(1))[0];

Coin(flip())
  .map((r) => (r & 1 ? '🪙' : '💩'))
  .map(console.log);
```

```js
const findMeaningOfLife = () => {
  const offset = 0;
  const delay = Infinity;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(42 + offset);
    }, delay);
  });
};
```

```js
class Coming {
  constructor() {
    return new Promise((resolve) => 
      setTimeout(() => {
        resolve(this);
      }, DAY_OF_JUDGMENT - Date.now())
    );
  }
}

const secondComing = await new Coming();
```

```ts
(
  (
    <F extends () => void>(
      Function: F = {} as F
    ) => Function()
  )()
)
```

```js
class Future {
  constructor() {
    const { name: key } = this.constructor;
    const value = void [].length;
    throw new Error(`${key} is ${value}`);
  }
}

new Future();
```