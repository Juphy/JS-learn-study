// 实现组合C
function C(arr, num) {
    var r = [];
    (function f(t, a, n) {
        if (n === 0) return r.push(t);
        for (var i = 0, l = a.length; i <= l - n; i++) {
            f(t.concat(a[i]), a.slice(i + 1), n - 1);
        }
    })([], arr, num);
    return r;
}

console.log(C([1, 2, 3, 4,], 5));

// 实现排列A
function A(arr, num) {
    let r = [];
    (function f(t, a, n) {
        if (n === 0) return r.push(t);
        for (var i = 0; i < a.length; i++) {
            f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
        }
    })([], arr, num);
    return r;
}

console.log(A([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 12).length);

// 其他方法实现组合C
function dp_combine(a, m) {
    var t = [[]], r = [];

    for (var i = 0, n = a.length; i < n; ++i) {
        for (var j = 0, l = t.length; j < l; ++j) {
            (t[j].length < m - 1 ? t : r).push(t[j].concat([a[i]]));
        }
    }
    return r;
}

console.log(dp_combine([1, 2, 3, 4], 3));

// 实现全排列的两种算法

/**
 *
 * AA和AA1的方法类似，使用插空法，取出字符串的首字母，然后将长度-1的串全排列，将首字母插入每一个排列的任意位置，
 * 类似于递归的调用
 */

function AA(str) {
    let r = [];
    if (str.length === 0) {
        return [];
    }
    if (str.length === 1) {
        return [str];
    } else {
        var s = AA(str.slice(1));
        for (var i = 0; i < s.length; i++) {
            for (var j = 0; j < s[i].length; j++) {
                var t = s[i].slice(0, j) + str[0] + s[i].slice(j);
                r.push(t);
            }
        }
        return r;
    }
}

console.log(AA('abcd'));
console.log(AA(['a', 'b', 'c', 'd']));

/**
 *
 * @param str 本次递归的字符串
 * @param r 前x个字符的全排列的结果
 * @returns {*}
 * @constructor
 * 1、每次取当次递归字符串的第一个字母
 * 2、若第二个参数长度为0说明是第一次递归，则初始化本次结果为[首字母]，然后将首字母从递归串中剔除，剩余串传给下一次递归
 * 3、之后每一次递归，都取递归串的首字母，将其插入前x个字符的全排列的所有位置，求出x+1个字符的全排列
 * 4、递归直到第一个参数为空串，则第二个参数为字符串所有字符的全排列。
 */

function AA1(str, r) {
    'use strict';
    let t = [];
    if (str.length === 0) {
        return r;
    } else {
        if (r.length === 0) {
            t.push(str[0]);
        } else {
            for (let i = 0; i < r.length; i++) {
                for (let j = 0; j <= r[i].length; j++) {
                    let temp = r[i].slice(0, j) + str[0] + r[i].slice(j);
                    t.push(temp);
                }
            }
        }
        return AA1(str.slice(1), t);
    }
}

// console.log(AA1('abcde', []));
console.log(AA1('abcdefghijkl', []).length);

function CC(a) {
    let r = [];
    (function f(t, n, a) {
        r.push(a[n]);
        for (let i = 0; i < t.length; i++) {
            r.push(t[i] + a[n]);
        }
        t = [];
        t.push.apply(t, r);
        if (n + 1 >= a.length) return t;
        else return f(t, n + 1, a);
    })([], 0, a);
    return r;
}

console.log(CC(['a', 'b', 'c', 'd']));


let arr = [
    ['a', 'b', 'c'],
    [1, 2, 3, 4],
    ['x', 'y', 'z']
];

function exchange(arr) {
    let r = [];
    (function f() {

    })(arr, i)
}
