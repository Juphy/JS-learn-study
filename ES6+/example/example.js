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

var fn = function(s) {
    return JSON.stringify(s)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')
}

var s = {
    a: String.fromCharCode(0x2028),
    b: String.fromCharCode(0x2029)
}