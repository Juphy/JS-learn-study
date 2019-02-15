let findIndex = function (arr, predicate, start = 0) {
    if (start >= 0 && start < arr.length) {
        if (predicate(arr[start])) {
            return start;
        }
        return findIndex(arr, predicate, start + 1);
    }
}
console.log(findIndex([1, 2, 3, 4, 5, 6, 7], x => x === 4));

// Array.prototype.map = function (callback) {
//     let res = [];
//     this.forEach(function (item, index) {
//         res.push(callback(item, index));
//     })
//     return res;
// }
// Array.prototype.filter = function (callback) {
//     let res = [];
//     this.forEach((item, index) => {
//         if (callback(item, index)) {
//             res.push(item);
//         }
//     })
//     return res;
// }
Array.prototype.concatAll = function () {
    let res = [];
    this.forEach(array => {
        res.push.apply(res, array);
    })

    // this.forEach(array => {
    //     array.forEach(item => {
    //         res.push(item);
    //     })
    // })

    // this.forEach(array => {
    //     res.push(...array);
    // })

    return res;
}

var courseLists = [{
    "name": "My Courses",
    "courses": [{
        "id": 511019,
        "title": "React for Beginners",
        "covers": [{
            width: 150,
            height: 200,
            url: "http://placeimg.com/150/200/tech"
        }, {
            width: 200,
            height: 200,
            url: "http://placeimg.com/200/200/tech"
        }, {
            width: 300,
            height: 200,
            url: "http://placeimg.com/300/200/tech"
        }],
        "tags": [{
            id: 1,
            name: "JavaScript"
        }],
        "rating": 5
    }, {
        "id": 511020,
        "title": "Front-End automat workflow",
        "covers": [{
            width: 150,
            height: 200,
            url: "http://placeimg.com/150/200/arch"
        }, {
            width: 200,
            height: 200,
            url: "http://placeimg.com/200/200/arch"
        }, {
            width: 300,
            height: 200,
            url: "http://placeimg.com/300/200/arch"
        }],
        "tags": [{
            "id": 2,
            "name": "gulp"
        }, {
            "id": 3,
            "name": "webpack"
        }],
        "rating": 5
    }]
}, {
    "name": "New Release",
    "courses": [{
        "id": 511022,
        "title": "Vue2 for Beginners",
        "covers": [{
            width: 150,
            height: 200,
            url: "http://placeimg.com/150/200/nature"
        }, {
            width: 200,
            height: 200,
            url: "http://placeimg.com/200/200/nature"
        }, {
            width: 300,
            height: 200,
            url: "http://placeimg.com/300/200/nature"
        }],
        "tags": [{
            id: 1,
            name: "JavaScript"
        }],
        "rating": 5
    }, {
        "id": 511023,
        "title": "Angular2 for Beginners",
        "covers": [{
            width: 150,
            height: 200,
            url: "http://placeimg.com/150/200/people"
        }, {
            width: 200,
            height: 200,
            url: "http://placeimg.com/200/200/people"
        }, {
            width: 300,
            height: 200,
            url: "http://placeimg.com/300/200/people"
        }],
        "tags": [{
            id: 1,
            name: "JavaScript"
        }],
        "rating": 5
    }]
}];

// var result = courseLists
//     .map(list => list.courses
//         .map(course => course.covers
//             .filter(cover => cover.width === 150)
//             .map(item => ({
//                 id: course.id,
//                 title: course.title,
//                 cover: item.url
//             }))
//         ).concatAll()
//     ).concatAll();

var result = courseLists.map(list => {
    return list.courses.map(course => {
        return course.covers.filter(cover => cover.width === 150).map(item => ({
            id: course.id,
            title: course.title,
            cover: item.url
        }))
    }).concatAll()
}).concatAll();
console.log(result);

Array.prototype.concatMap = function (callback) {
    return this.map(item => callback(item)).concatAll();
}

var result1 = courseLists.concatMap(list => {
    return list.courses.concatMap(course => {
        return course.covers.filter(cover => cover.width === 150).map(item => {
            return {
                id: course.id,
                title: course.title,
                cover: item.url
            }
        })
    })
})
console.log(result1);

// Oberver Pattern
// ES5
function ProducerA() {
    if (!(this instanceof ProducerA)) {
        throw new Error("Class constructor ProducerA cannot be invoked without 'new'");
    }
    this.listeners = [];
}

ProducerA.prototype.addListener = function (listener) {
    if (typeof listener === 'function') {
        this.listeners.push(listener);
    } else {
        throw new Error('listener 必须是 function');
    }
}

ProducerA.prototype.removeListener = function (listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
}

ProducerA.prototype.notify = function (message) {
    this.listeners.forEach(listener => {
        listener(message);
    })
}

// ES6
class Producer {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);
        } else {
            throw new Error('listener 必须是 function');
        }
    }

    removeListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    notify(message) {
        this.listeners.forEach(listener => {
            listener(message);
        })
    }
}

var egghead = new Producer();

function listener1(message) {
    console.log(message + 'from listener1');
}

function listener2(message) {
    console.log(message + 'from listener2');
}

egghead.addListener(listener1);
egghead.addListener(listener2);
egghead.notify('A new course!!');

// Iterator
function IteratorFromArray(arr) {
    if (!(this instanceof IteratorFromArray)) {
        throw new Error("请用new IteratorFromArray()!");
    }
    this._array = arr;
    this._cursor = 0;
}

IteratorFromArray.prototype.next = function () {
    return this._cursor < this._array.length ?
        {value: this._array[this._cursor++], done: false} :
        {value: undefined, done: true}
}

class Iterator {
    constructor(arr) {
        this._array = arr;
        this._cursor = 0;
    }

    next() {
        return this._cursor < this._array.length ?
            {value: this._array[this._cursor++], done: false} :
            {value: undefined, done: true}
    }

    map(callback) {
        const iterator = new Iterator(this._array);
        return {
            next: () => {
                const {done, value} = iterator.next();
                return {
                    done: done,
                    value: done ? undefined : callback(value)
                }
            }
        }
    }
}

var iterator = new Iterator([1, 2, 3, 4]);
var _iterator = iterator.map(value => value + 3);
console.log(_iterator.next());
console.log(_iterator.next());
console.log(_iterator.next());
console.log(_iterator.next());
console.log(_iterator.next());

// lazy evalution
function* getNumbers(words) {
    for (let word of words) {
        if (/^[0-9]+$/.test(word)) {
            yield parseInt(word, 10);
        }
    }
}

let iterator1 = getNumbers('10填阿萨德23按时1');
console.log(iterator1.next());
console.log(iterator1.next());
console.log(iterator1.next());
console.log(iterator1.next());
console.log(iterator1.next());
console.log(iterator1.next());

let Rx = require('rxjs');
var observable = Rx.Observable.create(observer => {
    console.log(1);
    observer.next('tom');
    console.log(2)
    observer.next('jerry');
})
console.log('start');
observable.subscribe(res => {
    console.log(res);
})
console.log('end');

var observable = Rx.Observable
    .create(function (observer) {
        observer.next('Jerry');
        observer.next('Anna');
        observer.complete();
        observer.next('not work');
    })

var observer = {
    next: function (value) {
        console.log(value);
    },
    error: function (error) {
        console.log(error)
    },
    complete: function () {
        console.log('complete')
    }
}

observable.subscribe(observer)

// fromEventPattern
var source = Rx.Observable.fromEventPattern(
    (handler) => egghead.addListener(handler),
    // egghead.addListener.bind(egghead),
    // egghead.removeListener.bind(egghead),
    (handler) => egghead.removeListener(handler),
);
source.subscribe({
    next(value) {
        console.log(value)
    },
    complete() {
        console.log('complete!')
    },
    error(error) {
        console.log(error);
    }
})
egghead.notify('hello! Can you hear me?');

// var source = Rx.Observable.interval(1000);
//
// source.subscribe({
//     next: function (value) {
//         console.log(value)
//     },
//     complete: function () {
//         console.log('complete!');
//     },
//     error: function (error) {
//         console.log('Throw Error: ' + error)
//     }
// });

Rx.Observable.map = function (callback) {
    return Rx.Observable.create(observer => {
        return this.subscribe( // 先subscribe在进行修改
            value => {
                try {
                    observer.next(callback(value))
                } catch (e) {
                    observer.error(e);
                }
            },
            (err) => {
                observer.error(err);
            },
            () => {
                observer.complete();
            }
        )
    })
}
var people = Rx.Observable.of('Tom', 'Jerry');
var hello_people = people.map(i => 'hello' + i);
hello_people.subscribe(console.log);

function map(callback) {
    return Rx.Observable.create((observer) => {
        return this.subscribe((value) => { // 先拿到，再发布
            try {
                observer.next(callback(value));
            } catch (e) {
                observer.error(e)
            }
        }, (err) => {
            observer.error(err);
        }, () => {
            observer.complete();
        })
    })
}

Rx.Observable.prototype.map = map;
var people = Rx.Observable.of("Jerry", "Anna");
var helloPeople = people.map(item => item + " Hello~");
helloPeople.subscribe(console.log);

var obs1 = Rx.Observable.interval(1000).take(5);
var obs2 = Rx.Observable.interval(500).take(2);
var obs3 = Rx.Observable.interval(800).take(1);
var source = Rx.Observable.of(obs1, obs2, obs3);
var example = source.concatAll();
example.subscribe({
    next: value => {
        console.log(value)
    },
    error: err => {
        console.log(err)
    },
    complete: () => {
        console.log('complete')
    }
})

Rx.Observable.interval(500).take(3)
    .merge(Rx.Observable.interval(300).take(6))
    .subscribe(res => {
        console.log(res);
    }, err => {
        console.log(err);
    }, () => {
        console.log("complete");
    });
Rx.Observable.interval(500).take(5)
    .zip(Rx.Observable.interval(300).take(6), (x, y) => x + y)
    .subscribe(res => {
        console.log(`【${res}】`);
    });
Rx.Observable.from("hello")
    .zip(Rx.Observable.interval(1000), (x, y) => x)
    .subscribe(res => {
        console.log(res);
    });

Rx.Observable.from('hello')
    .zip(Rx.Observable.interval(2000), (x, y) => x)
    .scan((origin, next) => origin + next, '')
    .subscribe(res => {
        console.log(res);
    })
    