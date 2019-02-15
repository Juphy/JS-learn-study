// function create(subscriber) {
//     var observable = {
//         subscribe: function (observer) {
//             subscriber(observer)
//         }
//     };
//     return observable;
// }
//
// var observable = create(function (observer) {
//     observer.next(1);
//     observer.next(2);
//     observer.next(3);
//     observer.complete();
//     observer.next('still work');
// })
//
// var observer = {
//     next: function (value) {
//         console.log(value)
//     },
//     complete: function () {
//         console.log('complete!')
//     }
// }
//
// observable.subscribe(observer);

// 预设空的observer
const emptyObserver = {
    next: () => {
    },
    error: (err) => {
        throw err
    },
    complete: () => {
    }
};

class Observer {
    constructor(destinationOrNext, error, complete) {
        switch (arguments.length) {
            case 0:
                // 空的observer
                this.destination = this.safeObserver(emptyObserver);
                break;
            case 1:
                if (!destinationOrNext) {
                    // 空的observer
                    this.destination = this.safeObserver(emptyObserver);
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    // 传入了observer物件
                    this.destination = this.safeObserver(destinationOrNext);
                    break;
                }
            default:
                // 如果上面都不是，代表应该是传入了一到三个function
                this.destination = this.safeObserver(destinationOrNext, error, complete);
                break;
        }
    }

    safeObserver(observerOrNext, error, complete) {
        let next;
        if (typeof (obserevrOrNext) === 'function') {
            // observerOrNext 是next function
            next = observerOrNext;
        } else if (observerOrNext) {
            // observerOrNext 是observer物件
            next = observerOrNext.next || function () {
            };
            error = observerOrNext.error || function (err) {
                throw err
            };
            complete = observerOrNext.complete || function () {
            };
        }
        // 最后回传observer
        return {
            next: next,
            error: error,
            complete: complete
        }
    }

    next(value) {
        if (!this.isStopped && this.next) {
            // 先判断是否停止过
            try {
                this.destination.next(value); // 传送值
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
        }
    }

    error(err) {
        if (!this.isStopped && this.error) {
            // 先判断是否停止过
            try {
                this.destination.error(err); // 传送错误
            } catch (anotherError) {
                this.unsubscribe();
                throw anotherError;
            }
            this.unsubscribe();
        }
    }

    complete() {
        if (!this.isStopped && this.complete) {
            // 先判断是否停止过
            try {
                this.destination.complete(); // 发送停止讯息
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
            this.unsubscribe(); // 发送停止讯息后退订
        }
    }

    unsubscribe() {
        this.isStopped = true;
    }
}

function create(subscriber) {
    const observable = {
        subscribe: function (observerOrNext, error, complete) {
            const realObserver = new Observer(...arguments);
            subscriber(realObserver);
            return realObserver;
        }
    };
    return observable;
}

var observable = create(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    observer.next('not work');
})

var observer = {
    next: function (value) {
        console.log(value)
    },
    complete: function () {
        console.log('complete!')
    }
}

observable.subscribe(observer);


class Observable {
    constructor(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe; // 把subscribe存到_subscribe属性中
        }
    }

    subscribe() {
        const observer = new Observer(...arguments);
        this._subscribe(observer);
        return observer;
    }
}

var observable = new Observable(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    observer.next('not work');
})

var observer = {
    next: function (value) {
        console.log(value)
    },
    complete: function () {
        console.log('complete!')
    }
}

observable.subscribe(observer);

Observable.create = function (subscribe) {
    return new Observable(subscribe);
}

var observable = Observable.create(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    observer.next('not work');
})

observable.subscribe(observer);
