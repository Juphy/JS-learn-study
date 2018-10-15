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

console.log(A([1, 2, 3, 4,], 5));
console.log(A([1, 2, 3, 4,], 5).length);

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

function AA(a) {
    let r = [];
    (function f(t, n, a) {
        r.push(a[n]);
        for (let i = 0; i < t.length; i++) {
            r.push(t[i] + a[n]);
        }
        t.push.apply(t, r);
        console.log(n, t);
        if (n + 1 >= a.length) return t;
        else return f(t, n + 1, a);
    })([], 0, a);
    return r;
}

AA(['a', 'b', 'c', 'd']);


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
