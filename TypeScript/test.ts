enum E {
    X, Y, Z
}
function f(obj: { X: number }) {
    return obj.X;
}
console.log(f(E));
