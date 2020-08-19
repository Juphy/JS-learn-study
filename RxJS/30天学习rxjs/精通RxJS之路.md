在网页的世界中存取任何资源都是非同步的，非同步常见的问题：

- 竞态条件（Race Condition）：每當我們對同一個資源同時做多次的非同步存取時，就可能發生 Race Condition 的問題。
- 记忆体泄漏（Memory Leak）：SPA 网站，如果有对 dom 注册监听事件，而没有在适当的时机把监听事件移除。
- 复杂的状态（Complex State）
- 意外处理（Exception Handling）

Functional Reactive Programming(FRP): Reactive Programming 及 Functional Programming

设计模式（Design Pattern）：Iterator Pattern、Observer Pattern。

- Observer Pattern（观察者模式）:DOM 的事件监听。[详见例子](./index.js)可以很好的说明 Observer Pattern 如何在事件（event）跟监听者（listener）的互动中做到去耦合。

- Iterator Pattern（遍历器模式）。[详见例子](./index.js)，Iterator 的优势：1、渐进式取得资料的特性可以用来做延迟运算（lazy evaluation）2、iterator 本身是序列，可以使用阵列的所有运算方法 map,filter。
  - 延迟运算（lazy evalution）是一种运算策略，延迟一种表达式的运算时机直到真正需要它的值在做运算，通过遍历器的 next()实现的运算就相当于延迟运算。

### Observable（Iterator Pattern+Observer Pattern）

Observable 就像是一个序列，里面的元素会随着时间推送；具備生產者推送資料的特性，同時能像序列，擁有序列處理資料的方法(map, filter...)。
Rxjs 既可以处理非同步行为也可以处理同步行为。

```
var observable = Rx.Observable
	.create(function(observer) {
		observer.next('Jerry');
		observer.next('Anna');

		setTimeout(() => {
			observer.next('Tom');
		}, 30)
	})

console.log('start');
observable.subscribe(function(value) {
	console.log(value);
});
console.log('end');
输出结果是：
start
Jerry
Anna
end
Tom
```

### Observer

Observable 可以被订阅(subscribe)，或说可以被观察，而订阅 Observable 的物件又被称为观察者(Observer)。观察者是一个具有三种方法的物件，每当 Observable 发生事件时，便会呼叫观察者相对应的方法。

```
var observable = Rx.Observable
	.create(function (observer) {
			observer.next('Jerry');
			observer.next('Anna');
	})

observable.subscribe({
	next: function(value) {
		console.log(value);
	},
	error: function(error) {
		console.log(error)
	},
	complete: function() {
		console.log('complete')
	}
})
```

Observable 的订阅在本质上与 Observer Pattern 是不一样的，订阅 Observable 的行为比较像执行一个物件的方法，并把资料传进这个方法中。向上面的代码，就可以改写成下面这样：

```
function subscribe(observer) {
		observer.next('Jerry');
		observer.next('Anna');
}

subscribe({
	next: function(value) {
		console.log(value);
	},
	error: function(error) {
		console.log(error)
	},
	complete: function() {
		console.log('complete')
	}
});
```

订阅一个 Observable 就像是执行一个 function。

### 常用的操作符（Operators）

- of(x,y,z)

```
var source = Rx.Observable.of('Jerry', 'Anna');

source.subscribe({
    next: function(value) {
        console.log(value)
    },
    complete: function() {
        console.log('complete!');
    },
    error: function(error) {
        console.log(error)
    }
});
```

- from([x,y,z])：参数可以是任何可以列举的参数，Set，WeakSet，Iterator，String，Promise（resolve 的结果，就会被送到 next，如果有错误则会送到 error，可以使用 fromPromise，会得到同样的结果）
- fromEvent：Event 建立 Obervable。第一个参数要传入的 DOM，第二个参数是传入要监听的事件名称。

```
var source = Rx.Observable.fromEvent(document.body, 'click');

source.subscribe({
    next: function(value) {
        console.log(value)
    },
    complete: function() {
        console.log('complete!');
    },
    error: function(error) {
        console.log(error)
    }
});
```

- fromEventPattern()参数一个类事件的实例，所谓的类事件就是指其行为跟事件相像，同时具有监听以及移除监听行为。[详见例子](./index.js)
- empty():空的 observable，订阅 observable 会直接送出 complete 的讯息。
- never():无穷的 observable，订阅 observable 什么都不会发生，但一直存在。
- throw():抛出错误直接跨过 next 和 complete，执行 error 事件。
- interval():参数必须是数值，数值代表发出讯号的时间间隔，会持续的发出一个从 0 开始递增的数值。interval(x)就相当于 timer(x, x)
- timer(x, y)：第一个参数代表发出第一个值的等待时间，第二个参数代表之后发送值的间隔时间。
- range(x, y): 接受两个数字型参数，一个起点，一个终点，然后按 1 递增，把中间的每个数字（含边界值）放入流中
- formPromise: 接收一个 promise，当这个 promise 有了输出时，就把这个输出放入到流中。注意的是，当 promise 作为参数传给`fromPromise`时，这个 Promise 就开始执行了，你就没有机会防止它被执行.
- defer: 参数是一个用来生产流的函数，当消费方需要流的时候，就会调用这个函数，创建一个流，并从这个流中进行消费（取数据）。因此，定义 defer 的时候，实际上还不存在一个真正的流，只是给出了创建这个流的方法，所以叫做惰性创建流

### Subscription

订阅 observable 之后，会回传一个 subscription，它具有释放资源的 unsubscribe 方法。

### Marble diagrams

```
----0--1--2--3----(1234)|--------X----|
```

Rx.Observable.interval(1000);
Rx.Observable.of(1,2,3,4); 小括号表示同步发生。
X 表示有错误发生，|表示 observable 结束;

```
source: ---0---1---2---3--- 原本observable
        map(x => x+1) operator
newest: ---1---2---3---4--- 新的observable
```

### Operator

Operator 是附加在 observable 上的函数，像 map，filter，concatAll。。。所有这些函数都会拿到原本的 observable 并回传一个新的 observable。

- map(function(){}):将值修改
- mapTo(value):修改成固定的值
- filter(function(){}):过滤
- take(number):取前几个值就结束
- first():等同于 take(1)取第一个元素
- observable1.takeUntil(observable2):在 observable1 发生时，让 observable2 直送出完成（complete）讯息。

```
observable1  :  ---0----1----2----3-----
observable2  :  --------------c-------
                takeUntil(click)
observable   :  ---0----1----2--|
```

- concatAll(): observable1.operator(e => observable2).concatAll()，Observable 返回的元素又是一个 observable，就像是一个二维阵列，阵列里面的元素是阵列，这是就可以用 concatAll 把它摊平成一维阵列。

```
observable1 : ------c------------c--------

        map(e => Rx.Observable.of(1,2,3))

observable2 : ------o------------o--------
                     \            \
                   (123)|        (123)|

                    concatAll()

observable  : ------(123)--------(123)-----
```

- skip(number):略过前几个元素

```
Rx.Observable.interval(1000).skip(3);
// 原本从0开始变成从3开始，但是原本需要等待的时间依然存在，因此取得第一个元素需要4秒
```

- takeLast(number):取得最后几个，takeLast 必须等到整个 observable 完成（complete），才能知道最后的元素有哪些，并且同步送出。

```
Rx.Observable.interval(6).take(6).takeLast(2)

 source: -----0----1----2----3----4----5|
            takeLast(2)
example: --------------------------------(45)|
```

- last():等同于 takeLast(1)取得最后一个元素
- concat():observable.concat(observable1, observable2)把多个 observable 实例合并成一个，也可以当做静态方法使用 Rx.Observable.concat(observable, observable1, observable2)

```
 observable: ---0---1---2|
observable1: (3)|
observable2: (456)|
               concat()
    example: ---0---1---2(3456)|
```

跟 concatAll()一样，必须等到前一个 observable 完成（complete），才会继续下一个。

- startWith(value):observable.startWith(value)；observable 一开始要发送的元素，并不影响 observable 本身产生值。

```
Rx.Observable.interval(1000).startWith(0)

 source: ---0---1---2---3---
        startWith(0)
example: (0)---0---1---2---3---
```

- merge:合并多个 observable 与 concat 不一样，concat 相当于将多个 observable 串联起来，merge 相当于把多个 observable 同时处理形成一个完整的 observable

```
Rx.Observale.interval(500).take(3).merge(Rx.Observable.interval(300).take(6))
 source: ----0----1----2|
source2: --0--1--2--3--4--5|
        merge()
example: --0-01--21-3--(24)--5|
```

- combineLatest:分别取得各个 observable 最后送出的值，在输出成一个值。

```
var source = Rx.Observable.interval(500).take(3);
var newest = Rx.Observable.interval(300).take(6);

var example = source.combineLatest(newest, (x, y) => x + y);

source : ----0----1----2|
newest : --0--1--2--3--4--5|

    combineLastest(newest,(x,y)=> x+y)

example: ----01--23-4--(56)--7|
不管是source还是newest送出值，只要另一方送出过值，就会执行callback并送出新的值。
当两者同时送出值，按照顺序分层次运算。
```

- zip:zip 会取每个 observable 相同顺位的元素传入 callback，也就是说每个 observable 的第 n 个元素会被传入 callback。如果另一个元素送出的速度较慢，就需要 cache 住没有处理的元素，等待比较慢的 observable，这就有可能造成记忆体相关的问题。

```
Rx.Observable.from('hello').zip(Rx.Observable.interval(200), (x,y)=> x)
间隔200ms依次送出“hello”
```

- withLatestFrom:与 combineLatest 类似，只是他有主从关系，只有在主要的 observable 送出新的值时，才会执行 callback，附属的 observable 只在背后运行。

```
var main = Rx.Observable.from("hello").zip(Rx.Observable.interval(500),(x,y) => x);
var some = Rx.Observable.from([0,1,0,0,0,1]).zip(Rx.Observable.interval(300),(x,y) => x);
var example = main.withLatestFrom(some, (x, y) => {
    return y===1? x.toUpperCase()
})

   main: ----h----e----l----l----o|
   some: --0--1--0--0--0--1|
  withLatestFrom(some, (x, y) => y===1? x.toUpperCase: x)
example: ----h----e----l----L----O|
```

withLatestFrom 会在 main 送出值的时候执行 callback，但是如果 main 送出值的时候 some 没有送出过任何值 callback 仍然不会执行。每当 main 送出值的时候，去判断 some 最后一次送出的值。常用在一些 checkbox 型的功能，例如一个编辑器，开启粗体后，打出来的字都要变黑，粗体就是 some observable，打字就是 main observable。

- scan：功能相当于 reduce 的功能，两者的最大差别在于 scan 会返回一个 observable 实例，而 reduce 返回的值可能是任何类型的值。常用于状态的计算处理。
  简单的按钮加减，分别将这两个 observable 直接 mapTo(1)和 mapTo(-1)。然后将 observable.empty()在设置初始值，接着使用 merge 将两个 observable 合并，scan 处理就可以得到状态值。

- buffer：5 个相关的 operators(buffer\bufferCount\bufferTime\bufferToggle\bufferWhen)，用来做事件的过滤
  - buffer：observable.buffer(observable1)，observable1 将原本的 observable 送出的元素缓存在阵列中，等到 observable1 送出元素时，才会将缓存的元素送出。
  ```
  var source= Rx.Observable.interval(300);
  var source2 = Rx.Observable.interval(1000);
  var example = source.buffer(source2);
  // [0,1,2]
  // [3,4,5]
  // [6,7,8]。。。
  ```
  - bufferTime：observable.bufferTime(number)，用时间做缓存，效果等同于 buffer
  ```
  var source = Rx.Observable.interval(300);
  var example = source.bufferTime(1000);
  // [0,1,2]
  // [3,4,5]
  // [6,7,8]。。。
  ```
  - bufferCount：bufferCount(number)，用个数做缓存，等同于 buffer
  ```
  var source = Rx.Observable.interval(3000);
  var example = source.bufferCount(3);
  // [0,1,2]
  // [3,4,5]
  // [6,7,8]。。。
  ```

- pairwise: 数据流a-b-c-d => [a,b]-[b,c]-[c,d]
- toArray: 数据流a-b-c-d => [a, b, c, d]。from的逆运算，from把数组打散了逐个放进流中，而toArray恰好相反，把流中的内容收集到一个数组中--直到这个流结束。

- delay：延迟一开始发送元素的时间点，delay(time/Date)，毫秒或者 Date 类型

```
var source = Rx.Observable.interval(300).take(5);
var example = source.delay(500);
   source: --0--1--2--3--4|
example: -------0--1--2--3--4|
```

```
var source = Rx.Observable.interval(300).take(5);
var example = source.delay(new Date(new Date().getTime()+1000));
```

- delayWhen：作用与 delay 类似，最大的差别是 delayWhen 可以影响每一个元素，而且需要 callback 回传一个 observable。

```
var source = Rx.Observable.interval(300).take(5);
var example = source.delayWhen(x => Rx.Observable.empty().delay(100*x*x));
```

- debounce：跟 buffer、bufferTime 一样，debounce 和 debounceTime 一个传入 observable，一个传入毫秒。debounce 每次接收元素，会把元素 cache 住并等待一段时间，如果这段时间内，没有收到任何元素，则把元素送出，如果在这段时间又收到新的元素，则会把原本 cache 住的元素释放掉并重新计时，不断反复。

```
var source = Rx.Observable,interval(300).take(5);
var example = source.debounceTime(1000)
// 4
```

- throttle、throttleTime：与 debounce、debounceTime 用法一致。

```
var source = Rx.Observable.interval(300).take(5);
var example = source.throttleTime(1000);
// 0
// 4
```

throttle 与 debounce 的比较：throttle 会先放出元素，等到有元素之后再沉默一段时间，等到时间过了又会开放发送元素。因此，throttle 适合于连续性的行为，控制行为的最高频率，debounce 则比较像必须等待的时间，要等到一定的时间过了才会收到元素。

- distinct：滤掉相同的项，distinct()会建立一个 Set，当接收到元素时，会先判断 Set 内是否有相同的值，如果有就不送出，如果没有则存到 Set 并送出，因此尽量不要把 distinct 用在一个无限的 observable 里，这样可能导致 Set 越来越大，所以建议放第二个参数 flushes，用来清除暂存的资料。
  - flushes：其實 flushes observable 就是在送出元素時，會把 distinct 的暫存清空，所以之後的暫存就會從頭來過，這樣就不用擔心暫存的 Set 越來愈大的問題，但其實我們平常不太會用這樣的方式來處理，通常會用另一個方法 distinctUntilChanged。
- distinctUntilChanged：与 distinct 的作用一样，但是 distinctUntilChanged 只会暂存一个元素，并在收到新的元素之后与暂存比较，比较常见的状况是做多方同步，当我们有多个 Client 时，每个 Client 有着各自的状态，Server 会在一个 Client 需要变动时通知所有的 Client 更新，但可能某些 Client 接收到新的状态其实跟上一次收到的是相同的，这时就可以用 distinctUntilChanged 方法只处理跟最后一次不相同的讯息。
- catch： 非同步错误处理方法，在 RxJS 中也能够直接用 catch 来处理错误，在 RxJS 中的 catch 可以回传一个 observable 来送出新的值，或者直接 Rx.Observable.empty()来直接结束。

```
Rx.Observable.from(['a', 'b', 'c', 'd', 2, 's'])
    .zip(Rx.Observable.interval(500), (x, y) => x)
    .map(x => x.toUpperCase())
    .catch((error, obs) => obs)
    .subscribe(res => {
        console.log(res);
    }, error => {
        console.log(error);
    });
```

如果回传当前的 observable，就会重新执行无线循环下去，这里可以用在断线重连的情景。

- retry：在一个 observable 发生错误时，重新尝试就可以用 retry 这个方法，和上面 catch 回传 observable 的效果是一致的。通常這種無限的 retry 會放在即時同步的重新連接，讓我們在連線斷掉後，不斷的嘗試。另外我們也可以設定只嘗試幾次，retry(number)。
- retryWhen(callback)：把发生 error 的元素放到另一个 observable 中，让我们可以直接操作这个 observable，并等到这个 observable 操作完后再重新订阅一次原本的 observable。通常使用 retryWhen 来做错误通知和 error 收集。
- repeat(number)：没有错误发生时，重复订阅。如果不给参数就会无限循环下去。很少单独使用，一般组合上delay操作，以提供

```
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x)
            .map(x => x.toUpperCase());
            // 通常 source 會是建立即時同步的連線，像是 web socket

var example = source.catch(
                (error, obs) => Rx.Observable.empty()
                               .startWith('連線發生錯誤： 5秒後重連')
                               .concat(obs.delay(5000))
                 );
模仿在即时同步断线时，利用catch返回一个新的observable。
```

- concatAll：使用时最重要的一点就是先处理完上一个 observable，才会处理下一个 observable

```
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));
var example = source.concatAll();
由于concatAll()会一个一个处理，一定是等前一个observable完成（complete）才会处理下一个observable，因为前一个observable是无限的，导致不会处理第二个。
```

- switch：同样是把二维的 observable 转为一维。在新的 observable 送出后直接处理新的 observable，不管前一个 observable 是否完成，每当有新的 observable 就会直接把旧的 observable 退订，永远只有最新的 observable。
- mergeAll：把二维的 observable 转为一维的，并且能够同时处理所有的 observable。mergeAll(number)数值代表可以同时处理 observable 的数量。如果传入的数字是 1，就和 concatAll()的效果一样。

```
Rx.Observable.from(document.body, 'click')
             .map(e => Rx.Observable.interval(1000))
             .mergeAll()
             .subscribe(res =>{
                console.log(res);
             })
  click: ----c-c-----------c---
        map(e => Rx.Observable.interval(1000))
 source: ----o-o-----------o---
              \ \           \ ---0---1---
               \ ---0---1---2---
                ---0---1---2---
                switch()
example: ------------00---11---22---33---(04)4--
```

- concatMap：map+concatAll

```
Rx.Observable.fromEvent(document.body, 'click')
             .map(e => Rx.Observable.interval(1000).take(3))
             .concatAll();
===>
Rx.Observable.fromEvent(document.body, 'click')
             .concatMap(e => Rx.Observable.interval(100).take(3))
```

类似这样的行为，常用在 request，如下：

```
function getPostData(){
    return fetch('https://jsonplaceholder.typicode.com/posts/1').then(res => res.json())
}
Rx.Observable.fromEvent(document.body, 'click')
                       .concatMap(e => Rx.Observable.from(getPostData()));
每点击一下就会送出一个HTTP request，快速点击时可以发现每个request是等前一个
request完成之后才会送出下一个request。
```

> concatMap(e => observable,(e, res, eIndex, resIndex)=>{})

concatMap 传入第二个参数 callback，callback 的参数分别是：外部 observable 送出的元素，内部 observable 送出的元素，外部 observable 送出的元素的 index，内部 observable 送出的元素 index。

```
Rx.Observable.fromEvent(document.body, 'click')
                       .concatMap(e => Rx.Observable.from(getPostData()),
                       (e, res, eIndex, resIndex) => res.title)
外部Observable送出的元素（e）是click event，内部observable送出的元素（e）就是response
```

- switchMap：map+switch

```
Rx.Observable.fromEvent(document.body, 'click')
                       .switchMap(e => Rx.Observable.fromEvent(getPostData()))
                       .subscribe(res =>{
                           console.log(res);
                       })
快速点击，每点击一次就会产生一个request，但是只会产生一次log。
这代表之前的request已经不会造成任何side-effect，这个很适合用在最后一次request的情景，
比如说自动完成（auto complete）,只需要显示使用者最后一次打在书面上的文字，来做建议选项而不用每一次的。
```

> switchMap(e => observable, (e, res, eIndex, resIndex) => {}) 参数与 concatMap 一致。

- mergeMap：map+mergeAll（flatMap=mergeMap）

```
Rx.Observable.fromEvent(document.body, 'click')
                       .mergeMap(e => Rx.Observable.from(getPostData()),
                       (e, res, eIndex, resIndex)=> res.title, 3)
限制同时发出的request的数量
```

> mergeMap(e => observable, (e, res, eIndex, resIndex)=> {}, 3)

- window(5 个 window 相关的 operators：window、windowCount、windowTime、windowToggle、windowWhen)
- window：类似于 buffer 可以把一段时间送出来的元素拆出来，只是 buffer 是把元素拆分到阵列中变成（Observable<T>=>Observable<Array<T>>）。window 则是会把元素拆出来放到新的 observable 变成（Observable<T>=>Observable<Observable<T>>）。observable.window(observable)，

```
// 统计一秒钟内触发了几次click事件
    var click = Rx.Observable.fromEvent(document, 'click'),
        source = Rx.Observable.interval(1000),
        example = click.window(source);
    example.map(innerObservable => innerObservable.count())
        .switch()
        .subscribe(console.log)
```

- windowToggle：windowToggle(observable, callback),第一个参数是 observable1，第二个参数是 callback，返回一个 observable2。送出来的 observable 始于 observable1，终于 observable2。

```
// 鼠标按下计数，松开停止记录
    var source1 = Rx.Observable.interval(1000),
        mouseDown$ = Rx.Observable.fromEvent(document, 'mousedown'),
        mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');
    var example1 = source1.windowToggle(mouseDown$, () => mouseUp$);
    example1.switch().subscribe(console.log);
```

- groupBy：把相同条件的元素拆分成一个 Observable

```
var people = [
    {name: 'Anna', score: 100, subject: 'English'},
    {name: 'Anna', score: 90, subject: 'Math'},
    {name: 'Anna', score: 96, subject: 'Chinese'},
    {name: 'Jerry', score: 80, subject: 'English'},
    {name: 'Jerry', score: 100, subject: 'Math'},
    {name: 'Jerry', score: 90, subject: 'Chinese'},
];
var source = Rx.Observable.from(people)
    .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source
    .groupBy(person => person.name)
    .map(group => group.reduce((acc, cur) => ({
        name: cur.name,
        score: cur.score + acc.score
    })))
    .mergeAll();
example.subscribe(console.log);
// { name: "Anna", score: 286 }
// { name: 'Jerry', score: 270 }
```

### Observable

Observable 的 operators 执行的特点：

- 延迟运算
- 渐进式取值

Rx.Observable.from([1,2,3,4,5]).map(x => x+1)的代码不会执行因为没有被订阅。

数组中都是必须完整的运算出每个元素的返回值并组成一个数组，在做下一个运算。

```
var source =[1,2,3,4,5];
var example = source
                            .filter(x => x%2===0) // 这里会运算并返回一个完整的阵列
                            .map(x => x+1) // 这里也会运算并返回一个完整的阵列
```

![数组中的操作运算](https://ws3.sinaimg.cn/large/8b2b1aafly1fzfd6qxiobg20dc08cto8.gif)

Observable 中的 operators 的运算方式跟数组的是完全不同的，虽然 Observable 的 operator 也会回传一个新的 observable，但因为元素是渐进式取得的关系，所以每次的运算是一个元素运算到底，而不是运算完全部的元素再返回。

```
Rx.Observable.from([1,2,3])
                       .filter(x =>x%2===0)
                       .map(x => x+1)
                       .subscribe(console.log)
每个元素送出后就是运算到底，在这个过程终不悔等待其他的元素运算，这就是渐进式的特性。
```

```
class IteratorFromArray{
    constructor(arr){
        this._array = arr;
        this._cursor = 0;
    }

    next(){
        return this._cursor < this._array.length?{value: this._array[this._cursor++], done: false}:{done: true};
    }
    map(callback){
        const iterator = new IteratorFromArray(this._array);
        return {
            next: () =>{
                const {done, value} = iterator.next();
                return {
                    done: done,
                    value: done?undefined: callback(value)
                }
            }
        }
    }
}

var myIterator = new IteratorFromArray([1,2,3]);
var newIterator = myIterator.map(x => x+1);
newIterator.next(); // {done: false, value: 2}
```

![Observable的操作运算](https://wx3.sinaimg.cn/large/8b2b1aafly1fzfdsdonv0g20dc08ch2j.gif)
渐进式取值的观念在 Observable 中其实非常的重要，这个特性也使得 Observable 相较于 Array 的 Operator 在做运算时更加的高效很多，尤其是在处理大量资料的时候会非常的明显。

### Subject

每个 observable 都是可以多次订阅的，每次订阅的执行都是完全独立的。

> 在有些情况下，我们希望第二次订阅 不会从头开始接受元素，而是从第一次订阅到当前处理的元素开始发送，这种处理方式成为组播（multicast），如何做到？

```
let Rx = require('rxjs');
var source = Rx.Observable.interval(1000).take(3);
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
};
var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
};

var subject = {
    observers: [],
    addObserver: function (observer) {
        this.observers.push(observer)
    },
    next: function (value) {
        this.observers.forEach(o => o.next(value))
    },
    error: function (error) {
        this.observer.forEach(o => o.error(error))
    },
    complete: function () {
        this.observers.forEach(o => o.complete())
    }
};
subject.addObserver(observerA);

source.subscribe(subject);

setTimeout(() => {
    subject.addObserver(observerB)
}, 1000);

建立subject，具备observer的所有方法（next，error，complete），并且还能addObserver把observer加到内部的清单中，每当有值送出就会遍历清单中的所有observer并把值再次送出，这样一来不管多久之后加进来的observer，都是会从当前处理到的元素继续往下走。subject订阅source并把observerA加到subject中，一秒之后再把observerB加到subject，这时就可以看到observerB直接是从1开始的，这就是（multicast）的行为。
```

Subject：Subject 既可以订阅 Observable 代表它是一个 Observer，同时 Subject 又可以被 Observer（observerA，observerB）订阅，代表它是一个 Observable。

- Subject 同時是 Observable 又是 Observer
- Subject 會對內部的 observers 清單進行組播(multicast)

```
var source = Rx.Observable.interval(1000).take(5);
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}
let subject = new Rx.Subject();
source.subscribe(subject);
subject.subscribe(observerA);
setTimeout(() =>{
    subject.subscribe(observerB)
}, 1000)
```

- subject 的 next 方法传值

所有订阅的 observer 就会接收到，又因为 Subject 本身是 Observable，这样的使用方式很适合用在某些无法直接使用 Observable 的前端框架中，例如 React 相对 DOM 的时间做监听。

```
class MyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.subject = new Rx.Subject();

        this.subject
            .mapTo(1)
            .scan((origin, next) => origin + next)
            .subscribe(x => {
                this.setState({ count: x })
            })
    }
    render() {
        return <button onClick={event => this.subject.next(event)}>{this.state.count}</button>
    }
}
```

#### BehaviorSubject

> 如果有一个新的订阅，我们希望 Subject 能立即给出最新的值，而不是没有回应？

```
var subject = new Rx.Subject();
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}
var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}
subject.subscribe(observerA);
subject.next(1); // 'A next: 1'
subject.next(2); // 'A next: 2'
subject.next(3); // 'A next: 3'
setTimeout(() =>{
    subject.subscribe(observerB); // 3秒后才订阅，这之后没有执行任何subject.next()，observerB不会收到任何值。
}, 3000)
如果想要observerB订阅时就能立即收到3，希望做到这样的效果就可以用BehaviorSubject。
```

BehaviorSubject 跟 Subject 最大的不同就是 BehaviorSubject 是用来呈现当前的值，而不是单纯的发送事件。BehaviorSubject 会记住最新一次发送的元素，并把该素当做目前的值，在使用上 BehaviorSubject 建构式需要传入一个参数来代表起始的状态。

```
var subject = new Rx.BehaviorSubject(0); // 0 为起始值
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
};
var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
};

subject.subscribe(observerA);
// A next: 0
subject.next(1)
// A next: 1
subject.next(2)
// A next: 2
subject.next(3)
// A next: 3

setTimeout(() =>{
    subject.subscribe(observerB)
    // B next: 3
}, 3000)
```

BehaviorSubject 在建立时就需要给定一个状态，并在之后任何一次订阅，就会先送出最新的状态，其实这种行为就是一种状态的表达而非单纯的事件。

#### ReplaySubject

在某些时候我们会希望 Subject 代表事件，但又能在新订阅时重新发送最后的几个元素，这时我们就可以用 ReplaySubject。

```
vat subject = new Rx.ReplaySubject(2);//  重复发送最后两个元素
var observerA ={
    next: value => console.log('A next: '+ value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('B complete!')
}

var observerB ={
    next: value => console.log('A next: '+ value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('B complete!')
}

subject.subscribe(observerA);
subject.next(1); // A next: 1
subject.next(2); // A next: 2
subject.next(3); // A next: 3

setTimeout(() =>{
    subject.subscribe(observerB);
    // B next: 2
    // B next: 3
}, 3000)
```

ReplaySubject(1)和 BehaviorSubject 的效果一致，但是本质是不一样的，BehaviorSubject 在建立时就会有起始值，比如 BehaviorSubject(0)起始值就是 0，BehaviorSubject 代表状态而 ReplaySubject 只是事件的重放而已。

#### AsyncSubject

会在 subject 结束后送出最后一个值，其余的值不会记录。

```
var subject = new Rx.AsyncSubject();

var observerA ={
    next: value => console.log(`A next: `+ value),
    error : error => console.log(`A error: `+ value),
    complete: () => console.log('A complete!')
}

var observerB ={
    next: value => console.log(`B next: `+ value),
    error : error => console.log(`B error: `+ value),
    complete: () => console.log('B complete!')
}

subject.subscribe(observerA)
subject.next(1)
subject.next(2)
subject.next(3)
subject.complete(); //  A next: 3  A complete!

setTimeout(() =>{
    subject.subscribe(observerB); // B next: 3  B complete!
}, 3000)
```

AsyncSubject 会在 subject 结束后才送出最后一个值，其实这个行为跟 Promise 很像，都是等到事情结束后送出一个值，但实际上非常少用到 AsyncSubject。

- multicast：用来挂载 subject 并回传一个可连结（connectable）的 observable

```
var source = Rx.Observable.interval(1000).take(3).multicast(new Rx.Subject());

var observerA = {
    next : value => console.log('A next: ' + value),
    error: error => console.log('A error: ' +error),
    complete: () => console.log('A complete!')
}

var observerB ={
    next : value => console.log('B next: ' + value),
    error: error => console.log('B error: ' +error),
    complete: () => console.log('B complete!')
}

var subscriptionA = source.subscribe(observerA) // subject.subscribe(observerA)
var realSubscription = source.connect() // source.subscribe(subject)
var subscriptionB;
setTimeout(() =>{
    subscriptionB = source.subscribe(observerB);
}, 1000);

setTimeout(() =>{
    subscriptionA.unsubscribe();
    subscriptionB.unsubscribe();
    // 这里虽然A跟B都退订了，但source还会继续送元素
}, 5000);

setTimeout(() => {
    realSubscription.unsubscribe();
    // 这里source才会真正停止送元素
}, 7000)

通过multicast来挂载一个subject之后，这个observable（source）的订阅其实都是订阅到subject上。
```

虽然 multicast 会让我们处理的对象少一点，但必须搭配 connect 一起使用还是让代码有点复杂，通常我们希望有 observer 订阅时，就立即执行并发送元素，而不要再多执行一个方法（connect），这时我们就可以使用 refCount。

- refCount：refCount 必须搭配 multicast 一起使用，它可以建立一个只要有订阅就会自动 connect 的 observable。

```
var source2 = Rx.Observable.interval(1000).take(5)
    .do(x => console.log('send: ' + x))
    .multicast(new Rx.Subject())
    .refCount();
var observerA2 = {
    next: value => console.log('2A next: ' + value),
    error: error => console.log('2A error: ' + error),
    complete: () => console.log('2A complete!')
};
var observerB2 = {
    next: value => console.log('2B next: ' + value),
    error: error => console.log('2B error: ' + error),
    complete: () => console.log('2B complete!')
};

var subscriptionA2 = source2.subscribe(observerA2); // 订阅数 0 => 1
var subscriptionB2;
setTimeout(() => {
    subscriptionB2 = source2.subscribe(observerB2) // 订阅数 0 => 2
}, 1000);

```

- publish：等同于 multicast(new Rx.Subject())

```
Rx.Observable.interval(1000).publish(1000).refCount();
=> Rx.Observable.interval(1000).multicast(new Rx.Subject()).refCount();

Rx.Observable.interval(1000).publishBehavior(0).refCount();
=> Rx.Observable.interval(1000).multicast(new Rx.BehaviorSubject(0))

Rx.Observable.interval(1000).publishReplay(1).refCount();
=> Rx.Observable.interval(1000).multicast(new Rx.ReplaySubject(1))

Rx.Observable.interval(1000).publishLast().refCount();
=> Rx.Observable.interval(1000).multicast(new Rx.AsyncSubject())
```

- share: publish+refCount 可以简写成 share

```
var source = Rx.Observable.interval(1000)
             .share();

// var source = Rx.Observable.interval(1000)
//             .publish()
//             .refCount();

// var source = Rx.Observable.interval(1000)
//             .multicast(new Rx.Subject())
//             .refCount();
```

#### Subject

Subject 其实是 Observer Design Pattern，所以当 observer 订阅到 subject 时，subject 会把订阅者塞到一份订阅者清单，在发送元素就是在遍历元素，并把元素一一送出。
Subject 之所以具有 Observable 的所有方法，是因为 Subject 继承了 Observable 的型别，其实 Subject 型别中主要的方法有 next、error、complete、subscribe、unsubscribe。

#### 一定要用 Subject 的时机

当一个 Observable 的操作过程中发生 side-effect，而我们不需要这个 side-effect 因为多个 subscribe 会导致触发多次。

```
var result = Rx.Observable.interval(1000).take(6)
                        .map(x => Math.random());
var subA = result.subscribe(x => console.log('A: ' + x));
var subB = result.subscribe(x => console.log('B: ' + x));
```

上面的代码 A 和 B 的结果不一致，代表 random（side-effect）被执行两次。

```
var result = Rx.Observable.interval(1000).take(6)
             .map(x => Math.random()) // side-effect
             .multicast(new Rx.Subject())
             .refCount();
var subA = result.subscribe(x => console.log('A: ' + x));
var subB = result.subscribe(x => console.log('B: ' + x));
```

### Scheduler

Scheduler 控制一个 observable 的订阅什么时候开始，以及发送元素什么时候送达，主要有以下三个元素组成：

- Scheduler 是一个资料结构。它知道如何根据优先级或其他标准来存储并排列任务。
- Scheduler 是一个执行环境。它意味着任务何时何地被执行，比如像立即执行、在 callback 中执行、setTimeout 中执行、animation frame 中执行
- Scheduler 是一个虚拟时钟。它透过 now()这个方法提供了时间的概念，我们可以让任务在特定的时间点被执行。

```
var observable = Rx.Observable.create(function(observer){
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
})

console.log('before subscribe');
observable.observeOn(Rx.Scheduler.async)
                  .subscribe({
                      next: (value) => {console.log(value)},
                      error: (err) => {console.log(err)},
                      complete: () => {console.log('complete')}
                  });
console.log('after subscribe');
// "before subscribe"
// "after subscribe"
// 1
// 2
// 3
// "complete"
上面的代码原本是同步执行，但是使用observable.observeOn(Rx.Scheduler.async)原本同步执行就变成非同步执行了。
```

使用不同的 operator 时，这些 operator 就会各自预设不同的 scheduler，例如一个无限的 observable 就会预设为 queue scheduler，而 timer 相关的 operator 则预设为 async scheduler。

最通用的方式时 observeOn()，只要是 observable 就可以使用这个方法。以下这几个 creation operators 最后一个参数都能接收 Scheduler

- bindCallback
- bindNodeCallback
- combineLatest
- concat
- empty
- from
- fromPromise
- interval
- merge
- of
- range
- throw
- timer

```
var observable = Rx.Observable.from([1,2,3,4,5], Rx.Scheduler.async);
```

#### operator
- xxxWhen：满足条件xxx

接收一个Observable型参数作为条件流，一旦这个条件流中出现任意数据，则进行xxxx操作。如`retryWhen(notifier$)`，其中`notifier$`就是一个条件流，当输入流出现异常时，就会开始等待`notifier$`流中出现数据，一旦出现了任何数据（不管是什么值），就会开始执行重试逻辑。

- xxxCount：拿到n个数据项时xxx

接收一个数字型参数作为阈值，一旦从输入流中取到了n个数据，则进行xxx操作。如`bufferCount(3)`表示每拿到3个数据就进行一次`buffer`操作。

- xxxTime：超时后xxx

接收一个超时时间作为参数，从输入流中龋数据，一旦达到超时时间，则进行xxx操作。

- xxxTo：用立即量代替Lambda表达式

接收一个立即量作为参数，相当于`xxx(()=>value)`。如`mapTo('a')`其实就是`map(() => 'a')`的语法糖，也就是说无论输入流中给出的值是什么，往输出流中放入的都是固定的值。

#### queue

queue 的运作方式跟预设的立即执行很像，但是当我们使用到返回方法时，会排列这些行为而非直接执行，一个递回的 operator 就是他会执行另一个 operator。repeat()，如果我们不给他参数的话，他就会执行无限多次。queue 很适合用在会有递回的 operator 且具有大量资料时使用，在这个情况下 queue 能避免不必要的效能损耗。

#### asap

asap 是非同步执行，在浏览器中其实就是 setTimeout 设为 0 秒。因为都是在 setTimeout 中执行，所以不会有 block event loop 的问题，很适合用在永远不会退订的 observable。

#### async

跟 asap 很像，但是使用 setInterval 来运作，通常是跟时间相关的 operator 才会用到。

#### animationFrame

跟 window.requestAnimationFrame 一摸一样。在做复杂运算，且高频率出发的 UI 动画时，就很适合使用 animationFrame，可以搭配 throttle operator 使用。
