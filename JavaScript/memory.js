using System;
using System.Threading;

public class Point
{
    private int x;
    private int y;

    public Point(int _x, int _y)
    {
        x = _x;
        y = _y;
    }

    public void Move(int dx, int dy)
    {
        // Атомарне додавання (CAS-подібна операція)
        Interlocked.Add(ref x, dx);
        Interlocked.Add(ref y, dy);
    }

    public Point Clone()
    {
        // Атомарне читання значень
        int currentX = Interlocked.CompareExchange(ref x, 0, 0);
        int currentY = Interlocked.CompareExchange(ref y, 0, 0);
        return new Point(currentX, currentY);
    }

    public override string ToString()
    {
        // Атомарне читання значень
        int currentX = Interlocked.CompareExchange(ref x, 0, 0);
        int currentY = Interlocked.CompareExchange(ref y, 0, 0);
        return $"({currentX}, {currentY})";
    }
}
class Program
{
    static void Main()
    {
        var p1 = new Point(10, 20);
        Console.WriteLine(p1.ToString());

        var c1 = p1.Clone();
        c1.Move(-5, 10);
        Console.WriteLine(c1.ToString());
    }
}
