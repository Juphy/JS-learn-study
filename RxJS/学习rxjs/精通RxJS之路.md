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
- concatAll：使用时最重要的一点就是先处理完上一个observable，才会处理下一个observable
```
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));
var example = source.concatAll();
由于concatAll()会一个一个处理，一定是等前一个observable完成（complete）才会处理下一个observable，因为前一个observable是无限的，导致不会处理第二个。
```
- switch：同样是把二维的observable转为一维。在新的observable送出后直接处理新的observable，不管前一个observable是否完成，每当有新的observable就会直接把旧的observable退订，永远只有最新的observable。
- mergeAll：把二维的observable转为一维的，并且能够同时处理所有的observable。mergeAll(number)数值代表可以同时处理observable的数量。如果传入的数字是1，就和concatAll()的效果一样。
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
类似这样的行为，常用在request，如下：
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

concatMap传入第二个参数callback，callback的参数分别是：外部observable送出的元素，内部observable送出的元素，外部observable送出的元素的index，内部observable送出的元素index。
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
> switchMap(e => observable, (e, res, eIndex, resIndex) => {}) 参数与concatMap一致。

- mergeMap：map+mergeAll（flatMap=mergeMap）
```
Rx.Observable.fromEvent(document.body, 'click')
                       .mergeMap(e => Rx.Observable.from(getPostData()),
                       (e, res, eIndex, resIndex)=> res.title, 3)
限制同时发出的request的数量                       
```
> mergeMap(e => observable, (e, res, eIndex, resIndex)=> {}, 3)

- window(5个window相关的operators：window、windowCount、windowTime、windowToggle、windowWhen)
- window：类似于buffer可以把一段时间送出来的元素拆出来，只是buffer是把元素拆分到阵列中变成（Observable<T>=>Observable<Array<T>>）。window则是会把元素拆出来放到新的observable变成（Observable<T>=>Observable<Observable<T>>）。observable.window(observable)，
```
// 统计一秒钟内触发了几次click事件
    var click = Rx.Observable.fromEvent(document, 'click'),
        source = Rx.Observable.interval(1000),
        example = click.window(source);
    example.map(innerObservable => innerObservable.count())
        .switch()
        .subscribe(console.log)
```
- windowToggle：windowToggle(observable, callback),第一个参数是observable1，第二个参数是callback，返回一个observable2。送出来的observable始于observable1，终于observable2。
```
// 鼠标按下计数，松开停止记录
    var source1 = Rx.Observable.interval(1000),
        mouseDown$ = Rx.Observable.fromEvent(document, 'mousedown'),
        mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');
    var example1 = source1.windowToggle(mouseDown$, () => mouseUp$);
    example1.switch().subscribe(console.log);
```
- groupBy：把相同条件的元素拆分成一个Observable
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
Observable的operators执行的特点：
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

Observable中的operators的运算方式跟数组的是完全不同的，虽然Observable的operator也会回传一个新的observable，但因为元素是渐进式取得的关系，所以每次的运算是一个元素运算到底，而不是运算完全部的元素再返回。
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
渐进式取值的观念在Observable中其实非常的重要，这个特性也使得Observable相较于Array的Operator在做运算时更加的高效很多，尤其是在处理大量资料的时候会非常的明显。

### Subject
每个observable都是可以多次订阅的，每次订阅的执行都是完全独立的。

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
Subject：Subject既可以订阅Observable代表它是一个Observer，同时Subject又可以被Observer（observerA，observerB）订阅，代表它是一个Observable。

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
- subject的next方法传值

所有订阅的observer就会接收到，又因为Subject本身是Observable，这样的使用方式很适合用在某些无法直接使用Observable的前端框架中，例如React相对DOM的时间做监听。
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
> 如果有一个新的订阅，我们希望Subject能立即给出最新的值，而不是没有回应？

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
BehaviorSubject跟Subject最大的不同就是BehaviorSubject是用来呈现当前的值，而不是单纯的发送事件。BehaviorSubject会记住最新一次发送的元素，并把该素当做目前的值，在使用上BehaviorSubject建构式需要传入一个参数来代表起始的状态。
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
BehaviorSubject在建立时就需要给定一个状态，并在之后任何一次订阅，就会先送出最新的状态，其实这种行为就是一种状态的表达而非单纯的事件。

#### ReplaySubject
在某些时候我们会希望Subject代表事件，但又能在新订阅时重新发送最后的几个元素，这时我们就可以用ReplaySubject。
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
ReplaySubject(1)和BehaviorSubject的效果一致，但是本质是不一样的，BehaviorSubject在建立时就会有起始值，比如BehaviorSubject(0)起始值就是0，BehaviorSubject代表状态而ReplaySubject只是事件的重放而已。

#### AsyncSubject
会在subject结束后送出最后一个值，其余的值不会记录。
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
AsyncSubject会在subject结束后才送出最后一个值，其实这个行为跟Promise很像，都是等到事情结束后送出一个值，但实际上非常少用到AsyncSubject。

- multicast：用来挂载subject并回传一个可连结（connectable）的observable

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
虽然multicast会让我们处理的对象少一点，但必须搭配connect一起使用还是让代码有点复杂，通常我们希望有observer订阅时，就立即执行并发送元素，而不要再多执行一个方法（connect），这时我们就可以使用refCount。

- refCount：refCount必须搭配multicast一起使用，它可以建立一个只要有订阅就会自动connect的observable。
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
- share: publish+refCount可以简写成share
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
Subject其实是Observer Design Pattern，所以当observer订阅到subject时，subject会把订阅者塞到一份订阅者清单，在发送元素就是在遍历元素，并把元素一一送出。
Subject之所以具有Observable的所有方法，是因为Subject继承了Observable的型别，其实Subject型别中主要的方法有next、error、complete、subscribe、unsubscribe。

#### 一定要用Subject的时机
当一个Observable的操作过程中发生side-effect，而我们不需要这个side-effect因为多个subscribe会导致触发多次。
```
var result = Rx.Observable.interval(1000).take(6)
                        .map(x => Math.random());
var subA = result.subscribe(x => console.log('A: ' + x));
var subB = result.subscribe(x => console.log('B: ' + x));
```
上面的代码A和B的结果不一致，代表random（side-effect）被执行两次。
```
var result = Rx.Observable.interval(1000).take(6)
             .map(x => Math.random()) // side-effect
             .multicast(new Rx.Subject())
             .refCount();
var subA = result.subscribe(x => console.log('A: ' + x));
var subB = result.subscribe(x => console.log('B: ' + x));
```

### Scheduler
Scheduler控制一个observable的订阅什么时候开始，以及发送元素什么时候送达，主要有以下三个元素组成：
- Scheduler是一个资料结构。它知道如何根据优先级或其他标准来存储并排列任务。
- Scheduler是一个执行环境。它意味着任务何时何地被执行，比如像立即执行、在callback中执行、setTimeout中执行、animation frame中执行
- Scheduler是一个虚拟时钟。它透过now()这个方法提供了时间的概念，我们可以让任务在特定的时间点被执行。
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
使用不同的operator时，这些operator就会各自预设不同的scheduler，例如一个无限的observable就会预设为queue scheduler，而timer相关的operator则预设为async scheduler。

最通用的方式时observeOn()，只要是observable就可以使用这个方法。以下这几个creation operators最后一个参数都能接收Scheduler
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

#### queue
queue的运作方式跟预设的立即执行很像，但是当我们使用到返回方法时，会排列这些行为而非直接执行，一个递回的operator就是他会执行另一个operator。repeat()，如果我们不给他参数的话，他就会执行无限多次。queue很适合用在会有递回的operator且具有大量资料时使用，在这个情况下queue能避免不必要的效能损耗。

#### asap
asap是非同步执行，在浏览器中其实就是setTimeout设为0秒。因为都是在setTimeout中执行，所以不会有block event loop的问题，很适合用在永远不会退订的observable。

#### async
跟asap很像，但是使用setInterval来运作，通常是跟时间相关的operator才会用到。

#### animationFrame
跟window.requestAnimationFrame一摸一样。在做复杂运算，且高频率出发的UI动画时，就很适合使用animationFrame，可以搭配throttle operator使用。
