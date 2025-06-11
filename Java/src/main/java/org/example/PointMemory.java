package org.example;


import java.util.concurrent.atomic.AtomicIntegerArray;

public class PointMemory {
    private static final int SIZE = 2;
    private final AtomicIntegerArray coords;

    public PointMemory(int x, int y) {
        coords = new AtomicIntegerArray(SIZE);
        coords.set(0, x);
        coords.set(1, y);
    }

    public void move(int dx, int dy) {
        coords.addAndGet(0, dx);
        coords.addAndGet(1, dy);
    }

    public PointMemory clonePoint() {
        int x = coords.get(0);
        int y = coords.get(1);
        return new PointMemory(x, y);
    }

    @Override
    public String toString() {
        int x = coords.get(0);
        int y = coords.get(1);
        return "(" + x + ", " + y + ")";
    }

    // Usage
    public static void main(String[] args) {
        PointMemory p1 = new PointMemory(10, 20);
        System.out.println(p1);

        PointMemory c1 = p1.clonePoint();
        c1.move(-5, 10);
        System.out.println(c1);
    }
}
