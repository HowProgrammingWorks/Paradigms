package org.example;

import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Supplier;

class IO<T> {
    private final Supplier<T> effect;

    private IO(Supplier<T> effect) {
        this.effect = effect;
    }

    public static <T> IO<T> of(Supplier<T> effect) {
        return new IO<>(effect);
    }

    public <R> IO<R> map(Function<T, R> fn) {
        return new IO<>(() -> fn.apply(effect.get()));
    }

    public <R> IO<R> chain(Function<T, IO<R>> fn) {
        return new IO<>(() -> fn.apply(effect.get()).run());
    }

    public T run() {
        return effect.get();
    }
}

class Point {
    private final int x;
    private final int y;

    private Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public static Point of(int x, int y) {
        return new Point(x, y);
    }

    public Point map(BiFunction<Integer, Integer, Point> fn) {
        return fn.apply(x, y);
    }

    public <R> R chain(BiFunction<Integer, Integer, R> fn) {
        return fn.apply(x, y);
    }
}

class PointTransform {
    private final BiFunction<Integer, Integer, Point> fn;

    public PointTransform(BiFunction<Integer, Integer, Point> fn) {
        this.fn = fn;
    }

    public Point ap(Point point) {
        return point.map(fn);
    }
}

class PointUtils {
    public static BiFunction<Integer, Integer, Point> move(int dx, int dy) {
        return (x, y) -> Point.of(x + dx, y + dy);
    }

    public static BiFunction<Integer, Integer, Point> clonePoint() {
        return Point::of;
    }

    public static BiFunction<Integer, Integer, IO<String>> toStringIO() {
        return (x, y) -> IO.of(() -> "(" + x + ", " + y + ")");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Point p1 = Point.of(10, 20);

        p1.chain(PointUtils.toStringIO())
          .map(s -> {
              System.out.println(s);
              return s;
          })
          .run();

        Point c0 = p1.map(PointUtils.clonePoint());

        PointTransform t1 = new PointTransform(PointUtils.move(-5, 10));
        Point c1 = t1.ap(c0);

        c1.chain(PointUtils.toStringIO())
          .map(s -> {
              System.out.println(s);
              return s;
          })
          .run();
    }
}
