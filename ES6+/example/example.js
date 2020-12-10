let a = Array.apply(null, Array(5)).map(Function.prototype.call.bind(Number));
console.log(a)

let b = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
}
console.log(Object.keys(b));
var d = Object.keys(b).map(a => a);
console.log(d);