import java.util.*

class Point(x: Int, y: Int) {
    private var x: Int = x
    private var y: Int = y
    val emitter = EventEmitter()

    init {
        emitter.on("move") { event ->
            val map = event as Map<*, *>
            this.x += (map["x"] as Int)
            this.y += (map["y"] as Int)
        }

        emitter.on("clone") { callback ->
            val point = Point(this.x, this.y)
            (callback as (Point) -> Unit)(point)
        }

        emitter.on("toString") { callback ->
            (callback as (String) -> Unit)("(${this.x}, ${this.y})")
        }
    }
}

class EventEmitter {
    private val listeners = mutableMapOf<String, MutableList<(Any) -> Unit>>()

    fun on(event: String, listener: (Any) -> Unit) {
        listeners.computeIfAbsent(event) { mutableListOf() }.add(listener)
    }

    fun emit(event: String, arg: Any) {
        listeners[event]?.forEach { it(arg) }
    }
}

// Usage
fun main() {
    val p1 = Point(10, 20)
    p1.emitter.emit("toString", { message: String -> println(message) })
    p1.emitter.emit("clone") { c1: Point ->
        c1.emitter.emit("toString", { message: String -> println(message) })
        c1.emitter.emit("move", mapOf("x" to -5, "y" to 10))
        c1.emitter.emit("toString", { message: String -> println(message) })
