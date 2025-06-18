public class Point {
    private int x;
    private int y;

    public Point(Integer x, Integer y) {
        this.x = x;
        this.y = y;
    }

    public void move(Integer dx, Integer dy) {
        this.x += dx;
        this.y += dy;
    }

    public Actor cloneAsActor() {
        return ActorClosureFactory.createActor(Point.class, this.x, this.y);
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
