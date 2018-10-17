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
mousedown的时候监听mousemove,然后mouseup时候停止监听:
```
mouseDown.map(event => mouseMove.takeUntil(mouseUp))
```

### Observer产生流


http://anata.me/2018/02/28/RxJS%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8B/
