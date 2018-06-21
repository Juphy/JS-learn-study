let Rx = require('rxjs');
var subject = new Rx.Subject();
subject.subscribe(x => {
    console.log('A' + x);
});
subject.subscribe(y => {
    console.log('B' + y);
});
subject.next(1);
subject.next(2);

var subject = new Rx.Subject();
subject.subscribe(x => {
    console.log('C' + x);
});
subject.subscribe(x => {
    console.log('D' + x);
});

let observable = Rx.Observable.from([1, 2, 3]);
observable.subscribe(subject);

var source = Rx.Observable.from([1, 2, 3, 4,]);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);
multicasted.subscribe(x => {
    console.log('E' + x);
});
multicasted.subscribe(x => {
    console.log('F' + x);
});
multicasted.connect();

var source = Rx.Observable.interval(500);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);
var subscription1, subscription2, subscriptionConnect;
var subscription1 = multicasted.subscribe(x => {
    console.log('observerA' + x);
});

subscriptionConnect = multicasted.connect();

setTimeout(() => {
    subscription2 = multicasted.subscribe(x => {
        console.log('observerB' + x);
    })
}, 600);

setTimeout(() => {
    subscription1.unsubscribe();
}, 1200);

// 这里我们应该取消共享的 Observable 执行的订阅，
// 因为此后 `multicasted` 将不再有订阅者
setTimeout(() => {
    subscription2.unsubscribe();
    subscriptionConnect.unsubscribe(); // 用于共享的 Observable 执行
}, 2000);


