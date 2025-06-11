interface Point {
    x: number;
    y: number;
}

interface PointFunctor extends Point {
    map: <T>(fn: (point: Point) => T) => T;
}

const createPointFunctor = ({ x, y }: Point): PointFunctor => ({
    x, 
    y,
    map: <T>(fn: (point: Point) => T): T => fn({ x, y })
});

const move = (delta: Point) => ({ x, y }: Point) =>
    createPointFunctor({
        x: x + delta.x,
        y: y + delta.y
    });

const clone = ({ x, y }: Point): PointFunctor => createPointFunctor({ x, y });

const pointToString = ({ x, y }: Point): string => `(${x}, ${y})`;

const pipe = (...fns: Array<(arg: Point) => Point>) => (arg: Point): Point =>
    fns.reduce((acc, fn) => fn(acc), arg);

const p1 = createPointFunctor({x: 10, y: 20});
console.log(p1.map(pointToString));

const operations = pipe(clone, move({ x: -5, y: 10 }));
console.log(pointToString(p1.map(operations)));


// move do not working
// to string is not acceptanble here 