// 考虑双击问题
let clicks = Rx.Observable.fromEvent(document.querySelector('#btn'), 'click');
// let interval = Rx.Observable.interval(1000);

// var interval = Rx.Observable.interval(1000);
// var buffered = interval.buffer(clicks);
// buffered.subscribe(x => console.log(x));

// var result = clicks.throttle(ev => Rx.Observable.interval(1000));
// result.subscribe(x => console.log(x));

clicks.map(e => 1)
    .scan((a, b) => a + b, 0)
    .throttleTime(1000)
    .subscribe(v => {
        console.log(v);
    })
