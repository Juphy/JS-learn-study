在网页的世界中存取任何资源都是非同步的，非同步常见的问题：
- 竞态条件（Race Condition）：每當我們對同一個資源同時做多次的非同步存取時，就可能發生 Race Condition 的問題。
- 记忆体泄漏（Memory Leak）：SPA网站，如果有对dom注册监听事件，而没有在适当的时机把监听事件移除。
- 复杂的状态（Complex State）
- 意外处理（Exception Handling）

Functional Reactive Programming(FRP): Reactive Programming及Functional Programming

设计模式（Design Pattern）：Iterator Pattern、Observer Pattern。

- Observer Pattern（观察者模式）:DOM的事件监听。[详见例子](./index.js)可以很好的说明Observer Pattern如何在事件（event）跟监听者（listener）的互动中做到去耦合。

- Iterator Pattern（遍历器模式）。[详见例子](./index.js)，Iterator的优势：1、渐进式取得资料的特性可以用来做延迟运算（lazy evaluation）2、iterator本身是序列，可以使用阵列的所有运算方法map,filter。
    - 延迟运算（lazy evalution）是一种运算策略，延迟一种表达式的运算时机直到真正需要它的值在做运算，通过遍历器的next()实现的运算就相当于延迟运算。

### Observable（Iterator Pattern+Observer Pattern）
Observable就像是一个序列，里面的元素会随着时间推送；具備生產者推送資料的特性，同時能像序列，擁有序列處理資料的方法(map, filter...)。
Rxjs既可以处理非同步行为也可以处理同步行为。
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
Observable可以被订阅(subscribe)，或说可以被观察，而订阅Observable的物件又被称为观察者(Observer)。观察者是一个具有三种方法的物件，每当Observable发生事件时，便会呼叫观察者相对应的方法。
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
Observable的订阅在本质上与Observer Pattern是不一样的，订阅Observable的行为比较像执行一个物件的方法，并把资料传进这个方法中。向上面的代码，就可以改写成下面这样：
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
订阅一个Observable就像是执行一个function。
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
- from([x,y,z])：参数可以是任何可以列举的参数，Set，WeakSet，Iterator，String，Promise（resolve的结果，就会被送到next，如果有错误则会送到error，可以使用fromPromise，会得到同样的结果）
- fromEvent：Event建立Obervable。第一个参数要传入的DOM，第二个参数是传入要监听的事件名称。
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
- empty():空的observable，订阅observable会直接送出complete的讯息。
- never():无穷的observable，订阅observable什么都不会发生，但一直存在。
- throw():抛出错误直接跨过next和complete，执行error事件。
- interval():参数必须是数值，数值代表发出讯号的时间间隔，会持续的发出一个从0开始递增的数值。
- timer(x, y)：第一个参数代表发出第一个值的等待时间，第二个参数代表之后发送值的间隔时间。

### Subscription
订阅observable之后，会回传一个subscription，它具有释放资源的unsubscribe方法。

### Marble diagrams
```
----0--1--2--3----(1234)|--------X----|
```
Rx.Observable.interval(1000);
Rx.Observable.of(1,2,3,4); 小括号表示同步发生。
X表示有错误发生，|表示observable结束;

```
source: ---0---1---2---3--- 原本observable
        map(x => x+1) operator
newest: ---1---2---3---4--- 新的observable
```

### Operator
Operator是附加在observable上的函数，像map，filter，concatAll。。。所有这些函数都会拿到原本的observable并回传一个新的observable。

- map(function(){}):将值修改
- mapTo(value):修改成固定的值
- filter(function(){}):过滤
- take(number):取前几个值就结束
- first():等同于take(1)取第一个元素
- observable1.takeUntil(observable2):在observable1发生时，让observable2直送出完成（complete）讯息。
```
observable1  :  ---0----1----2----3-----
observable2  :  --------------c-------
                takeUntil(click)
observable   :  ---0----1----2--|
```
- concatAll(): observable1.operator(e => observable2).concatAll()，Observable返回的元素又是一个observable，就像是一个二维阵列，阵列里面的元素是阵列，这是就可以用concatAll把它摊平成一维阵列。
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
- takeLast(number):取得最后几个，takeLast必须等到整个observable完成（complete），才能知道最后的元素有哪些，并且同步送出。
```
Rx.Observable.interval(6).take(6).takeLast(2)

 source: -----0----1----2----3----4----5|
            takeLast(2)
example: --------------------------------(45)|
```
- last():等同于takeLast(1)取得最后一个元素
- concat():observable.concat(observable1, observable2)把多个observable实例合并成一个，也可以当做静态方法使用Rx.Observable.concat(observable, observable1, observable2)
```
 observable: ---0---1---2|
observable1: (3)|
observable2: (456)|
               concat()
    example: ---0---1---2(3456)|
```
跟concatAll()一样，必须等到前一个observable完成（complete），才会继续下一个。
- startWith(value):observable.startWith(value)；observable一开始要发送的元素，并不影响observable本身产生值。
```
Rx.Observable.interval(1000).startWith(0)

 source: ---0---1---2---3---
        startWith(0)
example: (0)---0---1---2---3---
```
- merge:合并多个observable与concat不一样，concat相当于将多个observable串联起来，merge相当于把多个observable同时处理形成一个完整的observable
```
Rx.Observale.interval(500).take(3).merge(Rx.Observable.interval(300).take(6))
 source: ----0----1----2|
source2: --0--1--2--3--4--5|
        merge()
example: --0-01--21-3--(24)--5|
```
- comblineLatest:分别取得各个observable最后送出的值，在输出成一个值。
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
- zip:zip会取每个observable相同顺位的元素传入callback，也就是说每个observable的第n个元素会被传入callback。如果另一个元素送出的速度较慢，就需要cache住没有处理的元素，等待比较慢的observable，这就有可能造成记忆体相关的问题。
```
Rx.Observable.from('hello').zip(Rx.Observable.interval(200), (x,y)=> x)
间隔200ms依次送出“hello”
```
- withLatestFrom:与combineLatest类似，只是他有主从关系，只有在主要的observable送出新的值时，才会执行callback，附属的observable只在背后运行。
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
withLatestFrom会在main送出值的时候执行callback，但是如果main送出值的时候some没有送出过任何值callback仍然不会执行。每当main送出值的时候，去判断some最后一次送出的值。常用在一些checkbox型的功能，例如一个编辑器，开启粗体后，打出来的字都要变黑，粗体就是some observable，打字就是main observable。

- scan：功能相当于reduce的功能，两者的最大差别在于scan会返回一个observable实例，而reduce返回的值可能是任何类型的值。常用于状态的计算处理。
简单的按钮加减，分别将这两个observable直接mapTo(1)和mapTo(-1)。然后将observable.empty()在设置初始值，接着使用merge将两个observable合并，scan处理就可以得到状态值。

- buffer：5个相关的operators(buffer\bufferCount\bufferTime\bufferToggle\bufferWhen)，用来做事件的过滤
    - buffer：observable.buffer(observable1)，observable1将原本的observable送出的元素缓存在阵列中，等到observable1送出元素时，才会将缓存的元素送出。
    ```
    var source= Rx.Observable.interval(300);
    var source2 = Rx.Observable.interval(1000);
    var example = source.buffer(source2);
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]。。。
    ```
    - bufferTime：observable.bufferTime(number)，用时间做缓存，效果等同于buffer
    ```
    var source = Rx.Observable.interval(300);
    var example = source.bufferTime(1000);
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]。。。
    ```
    - bufferCount：bufferCount(number)，用个数做缓存，等同于buffer
    ```
    var source = Rx.Observable.interval(3000);
    var example = source.bufferCount(3);
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]。。。
    ```
- delay：延迟一开始发送元素的时间点，delay(time/Date)，毫秒或者Date类型
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
- delayWhen：作用与delay类似，最大的差别是delayWhen可以影响每一个元素，而且需要callback回传一个observable。
```
var source = Rx.Observable.interval(300).take(5);
var example = source.delayWhen(x => Rx.Observable.empty().delay(100*x*x));
```
- debounce：跟buffer、bufferTime一样，debounce和debounceTime一个传入observable，一个传入毫秒。debounce每次接收元素，会把元素cache住并等待一段时间，如果这段时间内，没有收到任何元素，则把元素送出，如果在这段时间又收到新的元素，则会把原本cache住的元素释放掉并重新计时，不断反复。
```
var source = Rx.Observable,interval(300).take(5);
var example = source.debounceTime(1000)
// 4
```
- throttle、throttleTime：与debounce、debounceTime用法一致。
```
var source = Rx.Observable.interval(300).take(5);
var example = source.throttleTime(1000);
// 0
// 4
```
throttle与debounce的比较：throttle会先放出元素，等到有元素之后再沉默一段时间，等到时间过了又会开放发送元素。因此，throttle适合于连续性的行为，控制行为的最高频率，debounce则比较像必须等待的时间，要等到一定的时间过了才会收到元素。

- distinct：滤掉相同的项，distinct()会建立一个Set，当接收到元素时，会先判断Set内是否有相同的值，如果有就不送出，如果没有则存到Set并送出，因此尽量不要把distinct用在一个无限的observable里，这样可能导致Set越来越大，所以建议放第二个参数flushes，用来清除暂存的资料。
    - flushes：其實 flushes observable 就是在送出元素時，會把 distinct 的暫存清空，所以之後的暫存就會從頭來過，這樣就不用擔心暫存的 Set 越來愈大的問題，但其實我們平常不太會用這樣的方式來處理，通常會用另一個方法 distinctUntilChanged。
- distinctUntilChanged：与distinct的作用一样，但是distinctUntilChanged只会暂存一个元素，并在收到新的元素之后与暂存比较，比较常见的状况是做多方同步，当我们有多个Client时，每个Client有着各自的状态，Server会在一个Client需要变动时通知所有的Client更新，但可能某些Client接收到新的状态其实跟上一次收到的是相同的，这时就可以用distinctUntilChanged方法只处理跟最后一次不相同的讯息。
- catch： 非同步错误处理方法，在RxJS中也能够直接用catch来处理错误，在RxJS中的catch可以回传一个observable来送出新的值，或者直接Rx.Observable.empty()来直接结束。
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
如果回传当前的observable，就会重新执行无线循环下去，这里可以用在断线重连的情景。

- retry：在一个observable发生错误时，重新尝试就可以用retry这个方法，和上面catch回传observable的效果是一致的。通常這種無限的 retry 會放在即時同步的重新連接，讓我們在連線斷掉後，不斷的嘗試。另外我們也可以設定只嘗試幾次，retry(number)。
- retryWhen(callback)：把发生error的元素放到另一个observable中，让我们可以直接操作这个observable，并等到这个observable操作完后再重新订阅一次原本的observable。通常使用retryWhen来做错误通知和error收集。
- repeat([number])：没有错误发生时，重复订阅。如果不给参数就会无限循环下去
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