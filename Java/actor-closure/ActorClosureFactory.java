import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Queue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class ActorClosureFactory {
    private static Class<?>[] convertParamTypes(Object... args) {
        Class<?>[] types = new Class<?>[args.length];
        for (int i = 0; i < args.length; i++) {
            types[i] = args[i].getClass();
        }

        return types;
    }

    private static <T> T instantiate(Class<T> clazz, Object... args) {
        Class<?>[] paramTypes = convertParamTypes(args);

        try {
            return clazz
                    .getConstructor(paramTypes)
                    .newInstance(args);
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Could not instantiate " + clazz, e);
        }
    }

    public static <T> Actor createActor(Class<T> clazz, Object... args) {
        final AtomicBoolean isProcessing = new AtomicBoolean(false);
        final Queue<Operation> queue = new ConcurrentLinkedQueue<>();
        final T state = instantiate(clazz, args);

        return new Actor() {
            @Override
            public void process() {
                new Thread(() -> {
                    if (!isProcessing.compareAndSet(false, true))
                        return;

                    while (!queue.isEmpty()) {
                        Operation operation = queue.poll();
                        CompletableFuture<Object> resolve = operation.resolve();

                        try {
                            Method method = state.getClass().getMethod(operation.method(), convertParamTypes(operation.args()));
                            Object result = method.invoke(state, operation.args());
                            resolve.complete(result);
                        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                            resolve.completeExceptionally(e);
                        }
                    }

                    isProcessing.set(false);
                }).start();
            }

            @Override
            public CompletableFuture<Object> send(String method, Object... args) {
                CompletableFuture<Object> resultReference = new CompletableFuture<>();

                queue.add(new Operation(method, args, resultReference));
                this.process();

                return resultReference;
            }
        };
    }
}
