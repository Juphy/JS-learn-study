let { pipe, Observable, merge } = require('rxjs')
let { concatMapTo, mergeMapTo, takeLast, last } = require('rxjs/operators');
var observable1 = Observable.create(observer => {
    setTimeout(() => {
        observer.next(1)
    }, 3000);
})
var observable2 = Observable.create(observer => {
    setTimeout(() => {
        observer.next(2)
    }, 2000);
})
var observable3 = Observable.create(observer => {
    setTimeout(() => {
        observer.next(3)
    }, 1000);
})

var observable = observable1.pipe(concatMapTo(observable2));


var a = 1, b = 2;
console.log(this);
(function () {
    var a = 2;
    eval('console.log("--",a)');
})();
(function(){
    var a = 2;
    (0, eval)('console.log(",,",a)');
})();