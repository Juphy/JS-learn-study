let Rx = require('rxjs');
// var observable = Rx.Observable.create(observer => {
//     observer.next(1);
//     observer.next(2);
//     observer.next(3);
//     observer.next(4);
//     setTimeout(() => {
//         observer.next(5);
//         observer.complete();
//     }, 1000)
// });
// observable.subscribe(
//     res => {
//         console.log(res);
//     },
//     err => {
//         console.log(err);
//     },
//     () => {
//         console.log('complete');
//     }
// );
//
// var subject = new Rx.Subject();
// subject.subscribe(x => {
//     console.log('A' + x);
// });
// subject.subscribe(y => {
//     console.log('B' + y);
// });
// subject.next(1);
// subject.next(2);
//
// var subject = new Rx.Subject();
// subject.subscribe(x => {
//     console.log('C' + x);
// });
// subject.subscribe(x => {
//     console.log('D' + x);
// });
//
// var observable = Rx.Observable.from([1, 2, 3]);
// observable.subscribe(subject);
//
// var source = Rx.Observable.from([1, 2, 3, 4,]);
// var subject = new Rx.Subject();
// var multicasted = source.multicast(subject);
// multicasted.subscribe(x => {
//     console.log('E' + x);
// });
// multicasted.subscribe(x => {
//     console.log('F' + x);
// });
// multicasted.connect();

// var source = Rx.Observable.interval(500);
// var subject = new Rx.Subject();
// var multicasted = source.multicast(subject);
// var subscription1, subscription2, subscriptionConnect;
// subscription1 = multicasted.subscribe(x => {
//     console.log('observerA' + x);
// });
// subscriptionConnect = multicasted.connect();
// setTimeout(() => {
//     subscription2 = multicasted.subscribe(x => {
//         console.log('observerB' + x);
//     })
// }, 600);
// setTimeout(() => {
//     subscription1.unsubscribe();
// }, 1200);
// setTimeout(() => {
//     subscription2.unsubscribe();
//     subscriptionConnect.unsubscribe();
// }, 2000);

// var source = Rx.Observable.interval(500);
// var subject = new Rx.Subject();
// var refCounted = source.multicast(subject).refCount();
//
// var subscription1, subscription2, subscriptionConnect;
//
// console.log('observer1 subscribed');
// subscription1 = refCounted.subscribe(x => {
//     console.log('observer1:' + x);
// });
// setTimeout(() => {
//     console.log('observer2 subscribed');
//     subscription2 = refCounted.subscribe(x => {
//         console.log('obsevrer2:' + x);
//     })
// }, 600);

// setTimeout(() => {
//     console.log('observer1 unsubscribed');
//     subscription1.unsubscribe()
// }, 1200);
//
// setTimeout(() => {
//     console.log('observer2 unsubscribed');
//     subscription2.unsubscribe();
// }, 2000);

// var subject = new Rx.BehaviorSubject(0);
// subject.subscribe(x => {
//     console.log('···observerA：' + x);
// });
// subject.next('000');
// subject.next('111');
// subject.next('222');
//
// subject.subscribe(x => {
//     console.log('···observerB：' + x);
// });
//
// subject.next('333');
//
// var subject = new Rx.ReplaySubject(3);
// subject.subscribe(x => {
//     console.log('observerA:' + x);
// });
// subject.next(1);
// subject.next(2);
// subject.next(3);
// subject.next(4);
// subject.subscribe(x => {
//     console.log('observerB:' + x);
// });
// subject.next(5);
//
// var subject = new Rx.ReplaySubject(100, 500 /* windowTime */);
// subject.subscribe(v => {
//     console.log('observerA:' + v);
// });
// var i = 1;
// setInterval(() => {
//     subject.next(i++);
// }, 200);
//
// setTimeout(() => {
//     subject.subscribe(v => {
//         console.log('observerB:' + v);
//     })
// }, 1000);

// var subject = new Rx.AsyncSubject();
// subject.subscribe(x => {
//     console.log('observerA:' + x);
// });
// subject.next(1);
// subject.next(2);
// subject.next(3);
// subject.next(4);
// subject.subscribe(v => {
//     console.log('observerB:' + v);
// });
// subject.next(5);
// subject.complete();

// let multiplyByTen = (input) => {
//     let output = Rx.Observable.create(observer => {
//         input.subscribe(
//             res => {
//                 observer.next(10 * res);
//             },
//             error => {
//                 observer.error(error);
//             },
//             () => {
//                 observer.complete();
//             })
//     });
//     return output;
// };
//
// let input = Rx.Observable.from([1, 2, 3, 4]);
// let output = multiplyByTen(input);
// output.subscribe(x => {
//     console.log(x);
// });
// input.map(x => x * 10)
//     .subscribe(y => {
//         console.log(y);
//     });


// 转换成 observables
/*Rx.Observable.of('foo', 'bar').subscribe(res => {
    console.log(res);
});

Rx.Observable.from([1, 2, 3]).subscribe(res => {
    console.log(res);
});

const fetch = require('node-fetch');
Rx.Observable
    .fromPromise(fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY').then(res => res.json()))
    .subscribe(json => {
        console.log(json);
    });

let fs = require('fs');
let exists = Rx.Observable.bindCallback(fs.exists);
exists('file.txt').subscribe(res => {
    console.log('Does file exists？', res);
});

let rename = Rx.Observable.bindNodeCallback(fs.rename);
rename('file.txt', 'users.txt').subscribe(() => {
    console.log('Renamed');
});*/

// 外部产生新事件
var myObservable = new Rx.Subject();
myObservable.subscribe(val => console.log(val));
myObservable.next('foo1');

// 内部产生新事件
var myObservable = Rx.Observable.create(observer => {
    observer.next('foo2');
    setTimeout(() => {
        observer.next('bar');
    }, 1000)
});
myObservable.subscribe(res => {
    console.log(res);
});

let stream$ = Rx.Observable.create(observer => {
    let i = 0;
    let timer = setInterval(() => {
        console.log('setInterval');
        observer.next(i++);
    }, 1000);

    return function () {
        clearInterval(timer);
    }
});

let subscription = stream$.subscribe(v => {
    console.log(v);
});

setTimeout(() => {
    subscription.unsubscribe();
}, 4000);
