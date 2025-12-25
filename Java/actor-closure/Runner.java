import java.util.concurrent.ExecutionException;

public class Runner {
    private static final String OUTPUT_METHOD = "toString";
    private static final String MOVE_METHOD = "move";
    private static final String CLONE_METHOD = "cloneAsActor";

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Actor actor = ActorClosureFactory.createActor(Point.class, 10, 20);

        // "toString" function must return string with coords
        String output = (String) actor.send(OUTPUT_METHOD).get();
        System.out.println(output); // "(10, 20)"

        // "cloneAsActor" function must create another actor
        Actor clone = (Actor) actor.send(CLONE_METHOD).get();
        System.out.println(actor == clone); // false

        // "move" function should not return anything
        Object move = clone.send(MOVE_METHOD, -5, 10).get();
        System.out.println(move); // null

        // "toString" on CLONED object must return changed coords
        String movedClonedOutput = (String) clone.send(OUTPUT_METHOD).get();
        System.out.println(movedClonedOutput); // "(5, 30)"

        // "toString" on SOURCE object must return original unchanged coords
        String movedSourceOutput = (String) actor.send(OUTPUT_METHOD).get();
        System.out.println(movedSourceOutput); // "(10, 20)"
    }
}
