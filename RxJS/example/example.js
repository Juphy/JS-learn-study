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
    })
