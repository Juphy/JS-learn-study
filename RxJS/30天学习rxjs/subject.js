let Rx = require('rxjs');
var source = Rx.Observable.interval(1000).take(3);
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
};
var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
};

var subject = {
    observers: [],
    addObserver: function (observer) {
        this.observers.push(observer)
    },
    next: function (value) {
        this.observers.forEach(o => o.next(value))
    },
    error: function (error) {
        this.observer.forEach(o => o.error(error))
    },
    complete: function () {
        this.observers.forEach(o => o.complete())
    }
};
subject.addObserver(observerA);

source.subscribe(subject);

setTimeout(() => {
    subject.addObserver(observerB)
}, 1000);

var _subject = new Rx.AsyncSubject();
var _observerA = {
    next: value => console.log('-A next: ' + value),
    error: error => console.log('-A error: ' + error),
    complete: () => console.log('-A complete!')
}

var _observerB = {
    next: value => console.log('-B next: ' + value),
    error: error => console.log('-B error: ' + error),
    complete: () => console.log('-B complete!')
}

_subject.subscribe(_observerA);
_subject.next(1);
_subject.next(2);
_subject.next(3);
_subject.complete();
// "A next: 3"
// "A complete!"

setTimeout(() => {
    _subject.subscribe(_observerB);
    // "B next: 3"
    // "B complete!"
}, 3000)

var source2 = Rx.Observable.interval(1000)
    .do(x => console.log('send: ' + x))
    .multicast(new Rx.Subject())
    .refCount();
var observerA2 = {
    next: value => console.log('2A next: ' + value),
    error: error => console.log('2A error: ' + error),
    complete: () => console.log('2A complete!')
};
var observerB2 = {
    next: value => console.log('2B next: ' + value),
    error: error => console.log('2B error: ' + error),
    complete: () => console.log('2B complete!')
};

var subscriptionA2 = source2.subscribe(observerA2); // 订阅数 0 => 1

var subscriptionB2;
setTimeout(() => {
    subscriptionB2 = source2.subscribe(observerB2) // 订阅数 0 => 2
}, 1000);

setTimeout(() => {
    subscriptionA2.unsubscribe(); // 订阅数 2 => 1
    subscriptionB2.unsubscribe(); // 订阅数 1 => 0，source停止发送元素
}, 5000);
