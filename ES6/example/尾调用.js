"use strict";

// 阶乘函数

function _factorial(n) {
    if (n <= 1) return 1;
    return n * _factorial(n - 1);
}

// 尾调用
function factorial(n, total = 1) {
    if (n <= 1) return total;
    return factorial(n - 1, n * total);
}

// 斐波那契
function _fib(n) {
    if (n <= 1) return 1;
    return _fib(n - 1) + _fib(n - 2);
}

// 尾调用
function fib(n, a = 1, b = 1) {
    if (n <= 1) return b;
    return fib(n - 1, b, a + b);
}

console.log(new Date());
console.log(fib(50));
console.log(new Date());
console.log(_fib(30));
console.log(new Date());

// 循环实现

function fib1(n, a = 1, b = 1) {
    while (n--) {
        [a, b] = [b, a + b];
    }
    return a;
}

console.log(new Date());
console.log(fib1(50));
console.log(new Date());
