class Point(var x: Int, var y: Int) {

    fun clone(): Point {
        return Point(x, y)
    }

    fun move(x: Int, y: Int) {
        this.x += x
        this.y += y
    }

    override fun toString(): String {
        return "(${x}, ${y})"
    }
}

// Usage
fun main() {
    val p1 = Point(10, 20)
    println(p1.toString())
    val c1 = p1.clone()
    c1.move(-5, 10)
    println(c1.toString())
}
