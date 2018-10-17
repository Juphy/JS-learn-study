var btn = document.getElementById('btn');

// 创建流
Rx.Observable.fromEvent(btn, 'click')
// .map(e => 1)
// .scan((a, b) => a + b)
    .scan(a => a + 1, 0) // 类似于reduce
    .subscribe(val => {
        console.log(val);
    });

// 合并流
Rx.Observable.fromEvent(document.querySelector('input[name="add"]'), 'click')
    .mapTo(1)
    .merge(
        Rx.Observable.fromEvent(document.querySelector('input[name="reduce"]'), 'click')
            .mapTo(-1)
    )
    .scan((a, b) => a + b)
    .subscribe(v => {
        console.log(v);
    });

// 扁平化
Rx.Observable.fromEvent(document.querySelector('#btn1'), 'click')
    .map(a => Rx.Observable.of(1, 2, 3)) // 返回的是一个Observable
    .concatAll()
    .subscribe(v => {
        console.log(v);
    });

Rx.Observable.fromEvent(document.querySelector('#btn1'), 'click')
    .flatMap(a => Rx.Observable.of(1, 2, 3)) // 返回的是一个Observable
    .subscribe(v => {
        console.log(v);
    });


let dragDOM = document.getElementById('drag'), body = document.body;
let mouseDown = Rx.Observable.fromEvent(dragDOM, 'mousedown');
let mouseUp = Rx.Observable.fromEvent(body, 'mouseup');
let mouseMove = Rx.Observable.fromEvent(body, 'mousemove');

mouseDown
    .flatMap(e => mouseMove.takeUntil(mouseUp)) // mouseDown的时候监听mouseMove，mouseUp的时候停止监听mouseMove
    .map(e => ({x: e.clientX, y: e.clientY}))
    .subscribe(pos => {
        dragDOM.style.left = pos.x + 'px';
        dragDOM.style.top = pos.y + 'px';
    });

var observable = Rx.Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.next(4);
    setTimeout(() => {
        observer.next(4);
        observer.complete();
    }, 1000);
});

console.log('just before subscribe');
observable.subscribe({
    next: x => console.log('Got value ' + x),
    error: err => console.log('something wrong occurred: ' + err),
    complete: () => console.log('done')
});

console.log('just after subscribe');
