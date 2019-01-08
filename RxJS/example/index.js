let Rx = require("rxjs");
var main = Rx.Observable.from('hello').zip(Rx.Observable.interval(500), (x, y) => x),
    some = Rx.Observable.from([0, 1, 0, 0, 0, 1]).zip(Rx.Observable.interval(300), (x, y) => x);
main.withLatestFrom(some, (x, y) => (y === 1 ? x.toUpperCase() : x))
    .subscribe(res => {
        // console.log(res);
    });

// combineLatest
Rx.Observable.interval(1000).take(4).combineLatest(Rx.Observable.interval(400).take(5), (x, y) => (x + y))
    .subscribe(res => {
        // console.log(res);
    });
// merge
Rx.Observable.interval(500).take(3).merge(Rx.Observable.interval(300).take(5))
    .subscribe(res => {
        // console.log(res);
    });
// startWith
Rx.Observable.interval(1000).take(5).startWith(3).subscribe(res => {
    // console.log(res);
});

// concat
Rx.Observable.interval(500).take(5).concat(Rx.Observable.interval(300).take(5), Rx.Observable.interval(400).take(4)).subscribe(res => {
    // console.log(res);
});

const validValue = (value, max, min) => {
    return Math.min(Math.max(value, min), max);
};

var arr = [1, 2, 3, 4];
var result = arr.reduce((a, i) => {
    return a + i
}, 0);
// console.log(result);

var source = Rx.Observable.interval(300).take(5);
var example = source.debounceTime(1000);

example.subscribe({
    next: (value) => {
        // console.log(value);
    },
    error: (err) => {
        // console.log('Error: ' + err);
    },
    complete: () => {
        // console.log('complete');
    }
});

var source = Rx.Observable.from(['a', 'b', 'c', 'a', 'b'])
    .zip(Rx.Observable.interval(300), (x, y) => x);
source.distinct().subscribe(res => {
    // console.log(res);
})

Rx.Observable.from([{value: 'a'}, {value: 'b'}, {value: 'c'}, {value: 'a'}, {value: 'b'}])
    .zip(Rx.Observable.interval(300), (x, y) => x)
    .distinct(x => {
        return x.value
    })
    .subscribe(res => {
        // console.log(res);
    });
Rx.Observable.from(['a', 'b', 'c', 'd', 2, 's'])
    .zip(Rx.Observable.interval(500), (x, y) => x)
    .map(x => x.toUpperCase())
    .catch(error => Rx.Observable.of('h'))
    .subscribe(res => {
        // console.log(res);
    }, error => {
        // console.log(error);
    });
Rx.Observable.from(['a', 'b', 'c', 'd', 2, 's'])
    .zip(Rx.Observable.interval(500), (x, y) => x)
    .map(x => x.toUpperCase())
    .catch((error, obs) => obs)
    .subscribe(res => {
        // console.log(res);
    }, error => {
        // console.log(error);
    });
Rx.Observable.from(['a', 'b', 'c', 'd', 2, 's'])
    .zip(Rx.Observable.interval(500), (x, y) => x)
    .map(x => x.toUpperCase())
    .retryWhen(obs => obs.delay(1000))
    .subscribe(res => {
        console.log(res);
    }, error => {
        console.log(error);
    });
