let button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click')
    .subscribe(() => {
        console.log('Clicked!')
    });

// 记录点击次数

// var count = 0;
// var button = document.querySelector('button');
// button.addEventListener('click', () => console.log(`Clicked ${++count} times`));

Rx.Observable.fromEvent(button, 'click')
    .scan(count => count + 1, 0)
    .subscribe(count => {
        console.log(`Clicked ${count} times`);
    });

// 只能在1000ms内最多点击一次

// let count = 0;
// let rate = 1000;
// let lastClick = Date.now();
// button.addEventListener('click', () => {
//     if (Date.now() - lastClick >= rate) {
//         console.log(`***Clicked ${++count} times`);
//         lastClick = Date.now();
//     }
// });

Rx.Observable.fromEvent(button, 'click')
    .throttleTime(1000)
    .scan(count => count + 1, 0)
    .subscribe(count => {
        console.log(`***Clicked ${count} times`);
    });

// 如何累加每次点击的鼠标 x 坐标

// var count = 0;
// var rate = 1000;
// var lastClick = Date.now();
// button.addEventListener('click', (e) => {
//     if (Date.now() - lastClick >= rate) {
//         count += e.pageX;
//         console.log(count);
//         lastClick = Date.now();
//     }
// })

Rx.Observable.fromEvent(button, 'click')
    .throttleTime(1000)
    .map(e => e.pageX)
    .scan((count, clientX) => count + clientX, 0)
    .subscribe(count => {
        console.log(count);
    });

let observable = Rx.Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    setTimeout(() => {
        observer.next(4);
        observer.complete();
    }, 1000)
});
console.log('before');
observable.subscribe(next => {
    console.log(next);
}, err => {
    console.log(err);
}, () => {
    console.log('done');
});
console.log('after');