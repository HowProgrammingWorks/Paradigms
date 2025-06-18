import java.util.concurrent.CompletableFuture;

public record Operation(
        String method,
        Object[] args,
        CompletableFuture<Object> resolve
) {}
