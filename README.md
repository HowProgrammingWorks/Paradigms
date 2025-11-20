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
  - Expression
  - Command-style
  - Declarative style
2. Identifiers
  - Assignment statement
  - Call arguments
  - Callable
3. State
  - Mutable state
  - Immutable state
  - Copy-on-write
  - Stateless functions
4. Context
  - Objects
  - Records
  - Closures
  - Containers
  - Modules
5. Branching
  - Conditional statement
  - Conditional expression
  - Guards
  - Pattern matching
6. Iteration
  - Loops (for, while, do)
  - Recursion calls (incl. tail recursion)
  - Iterators / Generators
  - Streams
7. Instantiation
  - Operator `new`
  - Creational patterns like Factory, Builder
  - Closures
  - Containers
  - Cloning
8. Inheritance
  - Classes (`extends`)
  - Interfaces (`implements`)
  - Prototype programming
  - Mixins
  - Composition
  - Partial/Curry
  - Traits
9. Primitive values
  - Scalars
  - Boxing
  - Value Objects
  - Containers
10. Asynchronity
  - Callback
  - Promise
  - Async/await
  - Future, Task
  - Async compose
  - Observer (EventEmitter, EventTarget, Signal)
  - Streams and other abstractions
11. Purity
  - Pure functions
  - Functions with side effects
  - IO monads
12. First-class functions
  - Higher-order functions
  - Passing behaviour as object
13. Evaluation Flow
  - Function composition
  - Nested calls
  - Pipeline `|>`
14. Point style
  - Point-free style: `const f = compose(g, h)`
  - Point style: `const f = (x) => g(h(x))`
15. Dependencies
  - Pass all dependencies as arguments
  - Dependency injection
  - Global namespaces
  - Service locators
  - Module systems
16. Structural Control
  - Pattern matching
  - Nested `if/else` conditionals
  - Guards
17. Error handling
  - Total functions
  - Throwing exceptions
  - Error codes
  - Return `null`, `undefined`, `NaN`
  - Null objects
  - Option / Either / Result / Promise
18. Stability of Effects
  - Idempotent operations
  - Order-sensitive operations
  - Commutative / associative operations
19. Semantic Transparency
  - Referential transparency
  - Equational reasoning
  - Deterministic evaluation
  - No hidden state
20. Caching
  - Hash-table caching
  - Memoization
21. Resource Control
  - Manual destruction
  - RAII / disposables
  - Region-based allocation
22. Concurrency Model
  - Shared-memory concurrency
  - Stateless functions
  - Message passing (Actor model)
  - Transactions
23. Data Ownership
  - Copy semantics
  - Move semantics
  - Shared vs exclusive references
24. Granularity
  - One-liners
  - Long code blocks
  - Moderate granularity
