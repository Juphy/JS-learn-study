## 入门
RxJS 是一个库，它通过使用 observable 序列来编写异步和基于事件的程序。它提供了一个核心类型 Observable，附属类型 (Observer、 Schedulers、 Subjects) 和受 [Array#extras] 启发的操作符 (map、filter、reduce、every, 等等)，这些数组操作符可以把异步事件作为集合来处理。

ReactiveX 结合了 观察者模式、迭代器模式 和 使用集合的函数式编程，以满足以一种理想方式来管理事件序列所需要的一切。

在 RxJS 中用来解决异步事件管理的的基本概念是：
- Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
- Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
- Subscription (订阅): 表示 Observable 的执行，主要用于取消 Observable 的执行。
- Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
- Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
- Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。

## 特性
- `纯净性`（Purity） 使得 RxJS 强大的正是它使用纯函数来产生值的能力

    ```
    通常你会创建一个非纯函数，这个函数之外也使用了共享变量的代码会把将你的应用状态搞得一团糟。
    var count = 0;
    var button = document.querySelector('button');
    button.addEventListener('click', () => console.log(`Clicked ${++count} times`));

    使用 RxJS 的话，你会将应用状态隔离出来。
    var button = document.querySelector('button');
    Rx.Observable.fromEvent(button, 'click')
      .scan(count => count + 1, 0)
      .subscribe(count => console.log(`Clicked ${count} times`));
    ```
    `scan`操作符的工作原理与数组的`reduce`类似。它需要一个暴露给回调函数当参数的初始值。每次回调函数运行后的返回值会作为下次回调函数运行时的参数。

- `流动性`（Flow） RxJS 提供了一整套操作符来帮助你控制事件如何流经 observables 。

    ```
    普通JavaScript
    var count = 0;
    var rate = 1000;
    var lastClick = Date.now() - rate;
    var button = document.querySelector('button');
    button.addEventListener('click', () => {
      if (Date.now() - lastClick >= rate) {
        console.log(`Clicked ${++count} times`);
        lastClick = Date.now();
      }
    });

    使用RxJS
    var button = document.querySelector('button');
    Rx.Observable.fromEvent(button, 'click')
      .throttleTime(1000)
      .scan(count => count + 1, 0)
      .subscribe(count => console.log(`Clicked ${count} times`));
    ```
    其他流程控制操作符有`filter`、`delay`、`debounceTime`、`take`、`takeUntil`、`distinct`、`distinctUntilChanged`等等
- 值（Values）对于流经 observables 的值，你可以对其进行转换。

    ```
    普通JavaScript
    var count = 0;
    var rate = 1000;
    var lastClick = Date.now() - rate;
    var button = document.querySelector('button');
    button.addEventListener('click', (event) => {
      if (Date.now() - lastClick >= rate) {
        count += event.clientX;
        console.log(count)
        lastClick = Date.now();
      }
    });

    使用RxJS
    var button = document.querySelector('button');
    Rx.Observable.fromEvent(button, 'click')
      .throttleTime(1000)
      .map(event => event.clientX)
      .scan((count, clientX) => count + clientX, 0)
      .subscribe(count => console.log(count));
    ```
    其他产生值的操作符有 pluck、pairwise、 sample 等等。
## Observable (可观察对象)
Observables 是多个值的惰性推送集合。它填补了下面表格中的空白：

||单个值|多个值|
|:---:|:---:|:---:|
|拉取|Function|Iterator|
|推送|Promise|Observable|

## 拉取（pull）推送（push）
拉取和推送是两种不同的协议，用来描述数据生产者 (Producer)如何与数据消费者 (Consumer)如何进行通信的。

`什么是拉取？` 在拉取体系中，由消费者来决定何时从生产者那接收数据。生产者本身不知道数据是何时交付到消费者手中的。每个 JavaScript 函数都是拉取体系。函数是数据的生产者，调用该函数的代码通过从函数调用中“取出”一个单个返回值来对该函数进行消费。

||生产者|消费者|
|:--:|:--:|:--:|
|拉取|被动的: 当被请求时产生数据。|主动的: 决定何时请求数据。|
|推送|主动的: 按自己的节奏产生数据。|被动的: 对收到的数据做出反应。|

`什么是推送？` 在推送体系中，由生产者来决定何时把数据发送给消费者。消费者本身不知道何时会接收到数据。在当今的 JavaScript 世界中，Promises 是最常见的推送体系类型。Promise(生产者) 将一个解析过的值传递给已注册的回调函数(消费者)，但不同于函数的是，由 Promise 来决定何时把值“推送”给回调函数。

RxJS 引入了 Observables，一个新的 JavaScript 推送体系。Observable 是多个值的生产者，并将值“推送”给观察者(消费者)。
- Function 是惰性的评估运算，调用时会同步地返回一个单一值。
- Generator 是惰性的评估运算，调用时会同步地返回零到(有可能的)无限多个值。
- Promise 是最终可能(或可能不)返回单个值的运算。
- Observable 是惰性的评估运算，它可以从它被调用的时刻起同步或异步地返回零到(有可能的)无限多个值。

## Observables 作为函数的泛化
Observables 既不像 EventEmitters，也不像多个值的 Promises 。在某些情况下，即当使用 RxJS 的 Subjects 进行多播时， Observables 的行为可能会比较像 EventEmitters，但通常情况下 Observables 的行为并不像 EventEmitters 。

> `Observables 像是没有参数, 但可以泛化为多个值的函数。`

> `订阅Observable类似于调用函数`

> `Observables 传递值可以是同步的，也可以是异步的。`

Observable 和 函数的区别是什么呢？Observable可以随着时间的推移“返回”多个值，这是函数所做不到的。

## Observable 剖析
Observables 是使用 Rx.Observable.create 或创建操作符创建的，并使用观察者来订阅它，然后执行它并发送 next / error / complete 通知给观察者，而且执行可能会被清理。这四个方面全部编码在 Observables 实例中，但某些方面是与其他类型相关的，像 Observer (观察者) 和 Subscription (订阅)。
Observable 的核心关注点：
- [创建](###创建)
- [订阅](###订阅)
- [执行](###执行)
- [清理](###清理)

### 创建
Rx.Observable.create是Observable构造函数的别名，它接受一个参数。
```
var observable = Rx.Observable.create(function subscribe(observer) {
  var id = setInterval(() => {
    observer.next('hi')
  }, 1000);
});
```
> Observables 可以使用 create 来创建, 但通常我们使用所谓的创建操作符, 像 of、from、interval、等等。

### 订阅
```
observable.subscribe(x => console.log(x));
```
> 订阅 Observable 像是调用函数, 并提供接收数据的回调函数。

observable.subscribe 和 Observable.create(function subscribe(observer) {...}) 中的 subscribe 有着同样的名字，这并不是一个巧合。在库中，它们是不同的，但从实际出发，你可以认为在概念上它们是等同的。

这表明 subscribe 调用在同一 Observable 的多个观察者之间是不共享的。当使用一个观察者调用 observable.subscribe 时，Observable.create(function subscribe(observer) {...}) 中的 subscribe 函数只服务于给定的观察者。对 observable.subscribe 的每次调用都会触发针对给定观察者的独立设置。

subscribe 调用是启动 “Observable 执行”的一种简单方式， 并将值或事件传递给本次执行的观察者。

### 执行
Observable.create(function subscribe(observer) {...}) 中...的代码表示 “Observable 执行”，它是惰性运算，只有在每个观察者订阅后才会执行。随着时间的推移，执行会以同步或异步的方式产生多个值。

Observable 执行可以传递三种类型的值：
- "Next" 通知： 发送一个值，比如数字、字符串、对象，等等。
- "Error" 通知： 发送一个 JavaScript 错误 或 异常。
- "Complete" 通知： 不再发送任何值。

"Next" 通知是最重要，也是最常见的类型：它们表示传递给观察者的实际数据。"Error" 和 "Complete" 通知可能只会在 Observable 执行期间发生一次，并且只会执行其中的一个。

> 在 Observable 执行中, 可能会发送零个到无穷多个 "Next" 通知。如果发送的是 "Error" 或 "Complete" 通知的话，那么之后不会再发送任何通知了。