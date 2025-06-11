import java.lang.reflect.Method;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.CompletableFuture;

public class Main {
    public static void main(String[] args) throws Exception {
        Actor p1 = new Actor(Point.class, 10, 20);

        System.out.println(p1.send(new Actor.Command("toString", new Object[]{})).get());

        Actor c1 = (Actor) p1.send(new Actor.Command("clonePoint", new Object[]{})).get();

        c1.send(new Actor.Command("move", new Object[]{-5, 10})).get();

        System.out.println(c1.send(new Actor.Command("toString", new Object[]{})).get());
    }
}

class Actor {
    private final Queue<Command> queue = new LinkedList<>();
    private boolean processing = false;
    private final Object state;

    public Actor(Class<?> entityClass, Object... args) {
        try {
            this.state = entityClass.getConstructor(getParameterTypes(args)).newInstance(args);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create actor state", e);
        }
    }

    public CompletableFuture<Object> send(Command command) {
        CompletableFuture<Object> future = new CompletableFuture<>();
        synchronized (queue) {
            queue.add(new Command(command.method, command.args, future));
            if (!processing) {
                processing = true;
                process();
            }
        }
        return future;
    }

    private void process() {
        new Thread(() -> {
            while (true) {
                Command command;
                synchronized (queue) {
                    command = queue.poll();
                    if (command == null) {
                        processing = false;
                        return;
                    }
                }
                try {
                    Method method = state.getClass().getMethod(command.method, getParameterTypes(command.args));
                    Object result = method.invoke(state, command.args);
                    command.resolve.complete(result);
                } catch (Exception e) {
                    command.resolve.completeExceptionally(e);
                }
            }
        }).start();
    }

    private Class<?>[] getParameterTypes(Object... args) {
        Class<?>[] types = new Class<?>[args.length];
        for (int i = 0; i < args.length; i++) {
            types[i] = getWrapperType(args[i].getClass());
        }
        return types;
    }

    private Class<?> getWrapperType(Class<?> clazz) {
        if (clazz == Integer.class) return int.class;
        if (clazz == Double.class) return double.class;
        if (clazz == Float.class) return float.class;
        if (clazz == Long.class) return long.class;
        if (clazz == Short.class) return short.class;
        if (clazz == Byte.class) return byte.class;
        if (clazz == Boolean.class) return boolean.class;
        if (clazz == Character.class) return char.class;
        return clazz;
    }

    public static class Command {
        public final String method;
        public final Object[] args;
        public final CompletableFuture<Object> resolve;

        public Command(String method, Object[] args) {
            this(method, args, new CompletableFuture<>());
        }

        public Command(String method, Object[] args, CompletableFuture<Object> resolve) {
            this.method = method;
            this.args = args;
            this.resolve = resolve;
        }
    }
}

class Point {
    private int x;
    private int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void move(int dx, int dy) {
        this.x += dx;
        this.y += dy;
    }

    public Actor clonePoint() {
        return new Actor(Point.class, this.x, this.y);
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
