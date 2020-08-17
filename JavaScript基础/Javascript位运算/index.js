// 加法 num1和num2
let add = (num1, num2) => {
    if (num2 == 0) return num1;
    let sum = num1 ^ num2, carry = (num1 & num2) << 1;
    return add(sum, carry);
}

let add1 = (a, b) => {
    let sum;
    while (b) {
        // 直到没有进位
        sum = a ^ b; // 不带进位加法
        b = (a & b) << 1; // 进位
        a = sum;
    }
    return a;
}

// 求1+2+…+n，要求不能使用乘除法、for、while、if、else、switch、case等关键字以及条件判断语句（A?B:C）

let sum1 = (n) => {
    return n && n + sum1(n - 1);
}

const sum = [
    function (n, s) {
        return s
    },
    function (n, s) {
        return s + n
    }
];
// let sum2 = (n, s) => {
//     return sum[Number(n > 0)](n-1, sum2(n-1, s+n))
// }

a = 28;
// console.log(a << 1); // 28*2
// console.log(a << 2); // 28*4
// console.log(a << 3); // 28*8
// console.log(a >> 1); // Math.floor(28/2)
// console.log(a >> 2); // Math.floor(28/4)
// console.log(a >> 3); // Math.floor(28/8)

b = -14;
// console.log(b << 1); // Math.floor(-14*2)
// console.log(b >> 1); // Math.floor(-14/2)
// console.log(b >> 2); // Math.floor(-14/4)
// console.log(b >> 3); // Math.floor(-14/8)

// 减法 首先取减数的补码，然后相加。
let reduce = (a, b) => {
    return add(a, add(~b, 1));
}

// console.log(reduce(17, 5));

// 乘法
let multiply = (a, b) => {
    let s = 0;
    while (b) {
        if (b & 1) s = add(s, a);
        a <<= 1;
        b >>= 1;
    }
    return s;
}

// 除法
let div = (a, b) => {
    let s = 0;
    for (let i = 31; i >= 0; i--) {
        if ((a >> i) >= b) {
            s += (1 << i);
            a -= (b << i);
        }
    }
    return s;
}

// 判断正负
let ispos = a => { // 正
    return a > 0
}

let isneg = a => { // 负
    return a < 0
}

let iszero = a => { // 0
    return a === 0;
}

// 取一个数的补码(反码+1) 也就是负数
let negtive = a => {
    return add(~a, 1);
}

// 正数乘法
let multiply1 = (a, b) => {
    let s = 0;
    while (b) {
        if (b & 1) s = add(s, a);
        a <<= 1;
        b >>= 1;
    }
    return s;
}

// 乘法
let multiply2 = (a, b) => {
    if (iszero(a) || iszero(b)) {
        return 0
    }
    if (ispos(a) && ispos(b)) {
        return multiply1(a, b);
    }
    if (isneg(a)) {
        if (isneg(b)) {
            return multiply1(negtive(a), negtive(b));
        }
        return negtive(multiply1(negtive(a), b));
    }
    return negtive(multiply1(a, negtive(b)));
}

console.log(multiply2(-5, 3));