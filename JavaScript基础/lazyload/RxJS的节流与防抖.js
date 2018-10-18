// RxJS实现节流
let stream$ = Rx.Observable.fromEvent(window, 'scroll').map(e => console.log(e));

stream$.debounceTime(1000).subscribe(v => {
    console.log(v);
});
