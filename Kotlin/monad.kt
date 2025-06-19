data class Point(val x: Int, val y: Int)

class Monad<T>(private val value: T) {

    companion object {
        fun <T> of(value: T): Monad<T> {
            return Monad(value)
        }
    }

    fun <R> map(fn: (T) -> R): Monad<R> {
        val valueCopy = deepCopy(value)
        return of(fn(valueCopy))
    }

    fun <R> chain(fn: (T) -> Monad<R>): Monad<R> {
        val valueCopy = deepCopy(value)
        return fn(valueCopy)
    }

    fun ap(container: Monad<Point>): Monad<Point> {
        val fn = value as (Point) -> Point
        return container.map(fn)
    }

    private fun <T> deepCopy(obj: T): T {
        return when (obj) {
            is Point -> Point(obj.x, obj.y) as T
            else -> obj
        }
    }
}

val move: (Map<String, Int>) -> (Point) -> Point = { d -> { p -> Point(p.x + d["x"]!!, p.y + d["y"]!!) } }
val clone: (Point) -> Point = { p -> Point(p.x, p.y) }
val toString: (Point) -> Monad<String> = { p -> Monad.of("(${p.x}, ${p.y})") }

// Usage
fun main() {
    val p1 = Monad.of(Point(10, 20))
    p1.chain(toString).map { println(it) }
    val c0 = p1.map(clone)
    val t1 = Monad.of(move(mapOf("x" to -5, "y" to 10)))
    val c1 = t1.ap(c0)
    c1.chain(toString).map { println(it) }
}
