import java.util.concurrent.CompletableFuture;

public interface Actor {
    void process();

    CompletableFuture<Object> send(String methodName, Object... args);
}
