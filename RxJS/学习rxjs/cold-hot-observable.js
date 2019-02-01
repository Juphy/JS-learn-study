let Rx = require("rxjs");
let obs1 = Rx.Observable.create(observer => observer.next(Date.now()));
obs1.subscribe(v => console.log('A-' + v))
obs1.subscribe(v => console.log('B-' + v))

let obs2 = Rx.Observable.create(observer => observer.next(Date.now())).publish();
obs2.subscribe(v => console.log('AA-' + v))
obs2.subscribe(v => console.log('BB-' + v))
obs2.connect();

let obs = Rx.Observable
    .interval(1000).take(3)
    .publish()
    .refCount()
setTimeout(() => {
    obs.subscribe(v => console.log('A' + v));
    setTimeout(() => {
        obs.subscribe(v => console.log('B' + v));
    }, 1000)
}, 2000);
