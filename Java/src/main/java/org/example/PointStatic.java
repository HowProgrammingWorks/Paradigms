package org.example;


public class PointStatic {
    private int x;
    private int y;

    public PointStatic(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public static void move(PointStatic point, int dx, int dy) {
        point.x += dx;
        point.y += dy;
    }

    public static PointStatic clone(PointStatic point) {
        return new PointStatic(point.x, point.y);
    }

    public static String toString(PointStatic point) {
        return "(" + point.x + ", " + point.y + ")";
    }

    // Usage
    public static void main(String[] args) {
        PointStatic p1 = new PointStatic(10, 20);
        System.out.println(PointStatic.toString(p1));

        PointStatic c1 = PointStatic.clone(p1);
        PointStatic.move(c1, -5, 10);
        System.out.println(PointStatic.toString(c1));
    }
}
