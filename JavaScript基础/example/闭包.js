let f3;
const f1 = function () {
    var n = 99;
    f3 = function () {
        n++;
    };
    let f2 = function () {
        console.log(n++);
    };
    return f2;
};
let a = f1();
a();
f3();
a();
a();

const fn1 = function (n) {
    let fn2 = function () {
        console.log(n++)
    };
    return fn2;
};

let next = fn1(0);
next();
next();
next();
