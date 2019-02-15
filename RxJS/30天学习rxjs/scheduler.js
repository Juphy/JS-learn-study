let Rx = require('rxjs');
var observable = Rx.Observable.create(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
})

console.log('before subscribe');
observable.observeOn(Rx.Scheduler.async)
    .subscribe({
        next: (value) => {
            console.log(value)
        },
        error: (err) => {
            console.log(err)
        },
        complete: () => {
            console.log('complete')
        }
    });
console.log('after subscribe');

