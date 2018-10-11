var btn = document.getElementById('btn');
Rx.Observable.fromEvent(btn, 'click')
// .map(e => 1)
// .scan((a, b) => a + b)
    .scan(a => a + 1, 0) // 类似于reduce
    .subscribe(val => {
        console.log(val);
    });

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

Rx.Observable.fromEvent(document.body, 'click')
    .map(a => Rx.Observable.of(1, 2, 3))
    .subscribe(v => {
        console.log(v);
    });


let dragDOM = document.getElementById('drag'), body = document.body;
let mouseDown = Rx.Observable.fromEvent(dragDOM, 'mousedown');
let mouseUp = Rx.Observable.fromEvent(body, 'mouseup');
let mouseMove = Rx.Observable.fromEvent(body, 'mousemove');
