### fromEvent产生流
Rx.Observable.fromEvent(选择器选择的DOM元素,事件类型(click, scroll等))

fromEvent将一个event转化为一个Observable，也就是一个数据流stream。

一个流可以使用操作符（Operator）进行操作加工，然后产生新的流。
- map 将流转换成新的流
- scan 类似于reduce(()=>{}, 默认初始值)

```
// 单独按钮累计+1
Rx.Observable.fromEvent(btn, 'click')
  .map(e => 1)
  .scan((total, now) => total + now)
  .subscribe(value => {
    console.log(value)
  })
```

![点击事件流](http://ww4.sinaimg.cn/large/8b2b1aafly1fw4g1ae4xig20hw0eyjsj.gif)

### 合并流
```
// +1和-1按钮
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
```
mapTo实现流的转化，merge将流合并，即从一个流转换成另一个流，然后scan将数据累加。

![合并流](http://ww1.sinaimg.cn/large/8b2b1aafly1fw4gn70l5cj20nl0ayjrz.jpg)

![合并流](http://ww1.sinaimg.cn/large/8b2b1aafly1fw4gnoqga2g20a7063myb.gif)

### 扁平化流
```
Rx.Observable.fromEvent(document.querySelector(''), click)
    .flatMap(e=> Rx.Observable.of([1,2,3]))
    .subscribe(v=>{
        console.log(v) // 1,2,3
    })
Rx.Observable.fromEvent(document.querySelector(''), click)
    .map(e => Rx.Observable.of([1,2,3]))
    .concatAll()
    .subscribe(v => {
        console.log(v) // 1,2,3
    })
```

flatMap操作符可以实现Observable扁平化
```
click: -----c---------c-------

       flatMap(e=>Rx.Observable.of(1,2,3));

source: ---(123)----(123)-----
```

concatAll将Observable扁平化
```
click:  ----c-----c-------c-----

        map(e => Rx.Observable.of(1,2,3))

source:-----O------O------O------
             \      \      \
             (1,2,3)(1,2,3)(1,2,3)
            concatAll()
example: ----(123)----(123)-------
```


### takeUntil
mousedown的时候监听mouseMove,然后mouseup时候停止监听mouseMove:
```
mouseDown.map(event => mouseMove.takeUntil(mouseUp))
```

### unsubscribe
虽然取消了订阅，但是开启的setInterval定时器并不会自动清理，我们需要自己返回一个清理函数。

```
let stream$ = Rx.Observable.create(observer => {
    let i=0;
    let timer = setInterval(()=>{
        console.log('interval');
        observer.next(i++);
    }, 1000);

    return function(){
        clearInterval(timer);
    }
});

let subscription = stream$.subscribe(v=>{
    console.log(v);
})

setTimeout(() =>{
    subscription.unsubscribe();
}, 4000)

```

### switchMap
能取消上一个已无用的请求，只保留最后的请求结果流，这样就确保处理展示的是最后的搜索的结果。

### debounceTime
表示经过n毫秒后，没有流入新值，那么才将值转入下一个环节

### delay
表示延迟多少秒之后触发

### take(n)
记录事件触发的个数小于等于n时，触发的事件。


http://anata.me/2018/02/28/RxJS%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8B/
