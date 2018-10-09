function* fn() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var f1 = fn();
f1.next(); // { value: 'hello', done: false }
f1.next(); // { value: 'world', done: false }
f1.next(); // { value: 'ending', done: true }
f1.next(); // { value: undefined, done: true }

function* fn1(a, b) {
    var cur = 0;
    var next;
    for (let i = 1; i < b; i++) {
        next = (i * a) / b;
        next = parseInt(next);
        yield [cur, next - cur];
        cur = next;
    }
    return [cur, next - cur];
}

var f2 = fn1(15, 5);
f2.next();  //{ value: [ 0, 3 ], done: false }
f2.next();  //{ value: [ 3, 3 ], done: false }
f2.next();  //{ value: [ 6, 3 ], done: false }
f2.next();  //{ value: [ 9, 3 ], done: false }
f2.next();  //{ value: [ 12, 0 ], done: true }
f2.next();  //{ value: undefined, done: true }

var arr = [1, [2, 3], [[4, 5], 6]];
var flat = function* (arr) {
    arr.forEach(item => {
        if (typeof item !== 'number') {
            yield* flat(item);
        } else {
            yield item;
        }
    })
};
for (var f of flat(arr)) {
    console.log(f);
}
