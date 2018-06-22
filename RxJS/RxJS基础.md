## 入门
RxJS 是一个库，它通过使用 observable 序列来编写异步和基于事件的程序。它提供了一个核心类型 Observable，附属类型 (Observer、 Schedulers、 Subjects) 和受 [Array#extras] 启发的操作符 (map、filter、reduce、every, 等等)，这些数组操作符可以把异步事件作为集合来处理。

> 可以把 RxJS 当做是用来处理事件的`Lodash`。

ReactiveX 结合了`观察者模式`、`迭代器模式`和`使用集合的函数式编程`，以满足以一种理想方式来管理事件序列所需要的一切。

在 RxJS 中用来解决异步事件管理的的基本概念是：
- Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
- Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
- Subscription (订阅): 表示 Observable 的执行，主要用于取消 Observable 的执行。
- Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
- Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
- Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。

## 特性
- `纯净性（Purity）` 使得 RxJS 强大的正是它使用纯函数来产生值的能力

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

- `流动性（Flow）` RxJS 提供了一整套操作符来帮助你控制事件如何流经 observables 。

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
- `值（Values）`对于流经 observables 的值，你可以对其进行转换。

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

### 拉取（pull）推送（push）
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

### Observables 作为函数的泛化
Observables 既不像 EventEmitters，也不像多个值的 Promises 。在某些情况下，即当使用 RxJS 的 Subjects 进行多播时， Observables 的行为可能会比较像 EventEmitters，但通常情况下 Observables 的行为并不像 EventEmitters 。

> `Observables 像是没有参数, 但可以泛化为多个值的函数。`

> `订阅Observable类似于调用函数`

> `Observables 传递值可以是同步的，也可以是异步的。`

Observable 和 函数的区别是什么呢？Observable可以随着时间的推移“返回”多个值，这是函数所做不到的。

### Observable 剖析
Observables 是使用 Rx.Observable.create 或创建操作符创建的，并使用观察者来订阅它，然后执行它并发送 next / error / complete 通知给观察者，而且执行可能会被清理。这四个方面全部编码在 Observables 实例中，但某些方面是与其他类型相关的，像 Observer (观察者) 和 Subscription (订阅)。
Observable 的核心关注点：
- [创建](####创建)
- [订阅](####订阅)
- [执行](####执行)
- [清理](####清理)

#### 创建
Rx.Observable.create是Observable构造函数的别名，它接受一个参数。
```
var observable = Rx.Observable.create(function subscribe(observer) {
  var id = setInterval(() => {
    observer.next('hi')
  }, 1000);
});
```
> Observables 可以使用 create 来创建, 但通常我们使用所谓的创建操作符, 像 of、from、interval、等等。

#### 订阅
```
observable.subscribe(x => console.log(x));
```
> 订阅 Observable 像是调用函数, 并提供接收数据的回调函数。

observable.subscribe 和 Observable.create(function subscribe(observer) {...}) 中的 subscribe 有着同样的名字，这并不是一个巧合。在库中，它们是不同的，但从实际出发，你可以认为在概念上它们是等同的。

这表明 subscribe 调用在同一 Observable 的多个观察者之间是不共享的。当使用一个观察者调用 observable.subscribe 时，Observable.create(function subscribe(observer) {...}) 中的 subscribe 函数只服务于给定的观察者。对 observable.subscribe 的每次调用都会触发针对给定观察者的独立设置。

subscribe 调用是启动 “Observable 执行”的一种简单方式， 并将值或事件传递给本次执行的观察者。

#### 执行
Observable.create(function subscribe(observer) {...}) 中...的代码表示 “Observable 执行”，它是惰性运算，只有在每个观察者订阅后才会执行。随着时间的推移，执行会以同步或异步的方式产生多个值。

Observable 执行可以传递三种类型的值：
- "Next" 通知： 发送一个值，比如数字、字符串、对象，等等。
- "Error" 通知： 发送一个 JavaScript 错误 或 异常。
- "Complete" 通知： 不再发送任何值。

"Next" 通知是最重要，也是最常见的类型：它们表示传递给观察者的实际数据。"Error" 和 "Complete" 通知可能只会在 Observable 执行期间发生一次，并且只会执行其中的一个。

> 在 Observable 执行中, 可能会发送零个到无穷多个 "Next" 通知。如果发送的是 "Error" 或 "Complete" 通知的话，那么之后不会再发送任何通知了。

#### 清理
因为 Observable 执行可能会是无限的，并且观察者通常希望能在有限的时间内中止执行，所以我们需要一个 API 来取消执行。因为每个执行都是其对应观察者专属的，一旦观察者完成接收值，它必须要一种方法来停止执行，以避免浪费计算能力或内存资源。

当调用了 observable.subscribe ，观察者会被附加到新创建的 Observable 执行中。这个调用还返回一个对象，即 Subscription (订阅)：
```
var subscription = observable.subscribe(x => console.log(x));
```

> 当你订阅了 Observable，你会得到一个 Subscription ，它表示进行中的执行。只要调用 unsubscribe() 方法就可以取消执行。

当我们使用 create() 方法创建 Observable 时，Observable 必须定义如何清理执行的资源。你可以通过在 function subscribe() 中返回一个自定义的 unsubscribe 函数。
```
// 如何清理使用了 setInterval 的 interval 执行集合
var observable = Rx.Observable.create(function subscribe(observer) {
  // 追踪 interval 资源
  var intervalID = setInterval(() => {
    observer.next('hi');
  }, 1000);

  // 提供取消和清理 interval 资源的方法
  return function unsubscribe() {
    clearInterval(intervalID);
  };
});
```

## Observer (观察者)
`什么是观察者？`  观察者是由 Observable 发送的值的消费者。观察者只是一组回调函数的集合，每个回调函数对应一种 Observable 发送的通知类型：next、error 和 complete 。下面的示例是一个典型的观察者对象：

```
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```
要使用观察者，需要把它提供给 Observable 的 subscribe 方法：
```
observable.subscribe(observer);
```
> 观察者只是有三个回调函数的对象，每个回调函数对应一种 Observable 发送的通知类型。

RxJS 中的观察者也可能是部分的。如果你没有提供某个回调函数，Observable 的执行也会正常运行，只是某些通知类型会被忽略，因为观察者中没有没有相对应的回调函数。

## Subscription (订阅)
`什么是 Subscription ？`  Subscription 是表示可清理资源的对象，通常是 Observable 的执行。Subscription 有一个重要的方法，即 unsubscribe，它不需要任何参数，只是用来清理由 Subscription 占用的资源。在上一个版本的 RxJS 中，Subscription 叫做 "Disposable" (可清理对象)。

```
var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe(x => console.log(x));
// 稍后：
// 这会取消正在进行中的 Observable 执行
// Observable 执行是通过使用观察者调用 subscribe 方法启动的
subscription.unsubscribe();
```
> Subscription 基本上只有一个 unsubscribe() 函数，这个函数用来释放资源或去取消 Observable 执行。

Subscription 还可以合在一起，这样一个 Subscription 调用 unsubscribe() 方法，可能会有多个 Subscription 取消订阅 。你可以通过把一个 Subscription 添加到另一个上面来做这件事：
```
var observable1 = Rx.Observable.interval(400);
var observable2 = Rx.Observable.interval(300);

var subscription = observable1.subscribe(x => console.log('first: ' + x));
var childSubscription = observable2.subscribe(x => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
  // subscription 和 childSubscription 都会取消订阅
  subscription.unsubscribe();
}, 1000);

// 执行结果
second: 0
first: 0
second: 1
first: 1
second: 2
```
Subscriptions 还有一个 remove(otherSubscription) 方法，用来撤销一个已添加的子 Subscription。

## Subject (主体)
`什么是 Subject？`  RxJS Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。

> Subject 像是 Observable，但是可以多播给多个观察者。Subject 还像是 EventEmitters，维护着多个监听器的注册表。

*每个 Subject 都是 Observable。* - 对于 Subject，你可以提供一个观察者并使用 subscribe 方法，就可以开始正常接收值。从观察者的角度而言，它无法判断 Observable 执行是来自普通的 Observable 还是 Subject 。在 Subject 的内部，subscribe 不会调用发送值的新执行。它只是将给定的观察者注册到观察者列表中，类似于其他库或语言中的 addListener 的工作方式。

*每个 Subject 都是观察者。* - Subject 是一个有如下方法的对象： next(v)、error(e) 和 complete() 。要给 Subject 提供新值，只要调用 next(theValue)，它会将值多播给已注册监听该 Subject 的观察者们。

```
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(1);
subject.next(2);

// 输出结果
observerA: 1
observerB: 1
observerA: 2
observerB: 2
```

因为 Subject 是观察者，这也就在意味着你可以把 Subject 作为参数传给任何 Observable 的 subscribe 方法。
```
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

var observable = Rx.Observable.from([1, 2, 3]);

observable.subscribe(subject); // 你可以提供一个 Subject 进行订阅

// 执行结果
observerA: 1
observerB: 1
observerA: 2
observerB: 2
observerA: 3
observerB: 3
```
### 多播的 Observables
“多播 Observable” 通过 Subject 来发送通知，这个 Subject 可能有多个订阅者，然而普通的 “单播 Observable” 只发送通知给单个观察者。

> 多播 Observable 在底层是通过使用 Subject 使得多个观察者可以看见同一个 Observable 执行。

multicast 操作符的工作原理：观察者订阅一个基础的 Subject，然后 Subject 订阅源 Observable。

```
var source = Rx.Observable.from([1, 2, 3]);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);

// 在底层使用了 `subject.subscribe({...})`:
multicasted.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
multicasted.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

// 在底层使用了 `source.subscribe(subject)`:
multicasted.connect();
```

multicast 操作符返回一个 Observable，它看起来和普通的 Observable 没什么区别，但当订阅时就像是 Subject 。multicast 返回的是 ConnectableObservable，它只是一个有 connect() 方法的 Observable 。

connect() 方法十分重要，它决定了何时启动共享的 Observable 执行。因为 connect() 方法在底层执行了 source.subscribe(subject)，所以它返回的是 Subscription，你可以取消订阅以取消共享的 Observable 执行。

### 引用计数
手动调用 connect() 并处理 Subscription 通常太笨重。通常，当第一个观察者到达时我们想要自动地连接，而当最后一个观察者取消订阅时我们想要自动地取消共享执行。

> refCount 的作用是，当有第一个订阅者时，多播 Observable 会自动地启动执行，而当最后一个订阅者离开时，多播 Observable 会自动地停止执行。refCount的执行顺序要晚于其他订阅者。

```
var source = Rx.Observable.interval(500);
var subject = new Rx.Subject();
var refCounted = source.multicast(subject).refCount();
var subscription1, subscription2, subscriptionConnect;

// 这里其实调用了 `connect()`，
// 因为 `refCounted` 有了第一个订阅者
console.log('observerA subscribed');
subscription1 = refCounted.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

setTimeout(() => {
  console.log('observerB subscribed');
  subscription2 = refCounted.subscribe({
    next: (v) => console.log('observerB: ' + v)
  });
}, 600);

setTimeout(() => {
  console.log('observerA unsubscribed');
  subscription1.unsubscribe();
}, 1200);

// 这里共享的 Observable 执行会停止，
// 因为此后 `refCounted` 将不再有订阅者
setTimeout(() => {
  console.log('observerB unsubscribed');
  subscription2.unsubscribe();
}, 2000);

// 执行结果
observerA subscribed
observerA: 0
observerB subscribed
observerA: 1
observerB: 1
observerA unsubscribed
observerB: 2
observerB unsubscribed
```
refCount() 只存在于 ConnectableObservable，它返回的是 Observable，而不是另一个 ConnectableObservable 。

### BehaviorSubject
Subject 的其中一个变体就是 BehaviorSubject，它有一个“当前值”的概念。它保存了发送给消费者的最新值。并且当有新的观察者订阅时，会立即从 BehaviorSubject 那接收到“当前值”。

> BehaviorSubjects 适合用来表示“随时间推移的值”。举例来说，生日的流是一个 Subject，但年龄的流应该是一个 BehaviorSubject。

BehaviorSubject 使用值0进行初始化，当第一个观察者订阅时会得到0。第二个观察者订阅时会得到值2，尽管它是在值2发送之后订阅的。
```
var subject = new Rx.BehaviorSubject(0); // 0是初始值

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(3);

// 输出结果，始终保留当前最新的值。
observerA: 0
observerA: 1
observerA: 2
observerB: 2
observerA: 3
observerB: 3
```

### ReplaySubject
ReplaySubject 类似于 BehaviorSubject，它可以发送旧值给新的订阅者，但它还可以记录 Observable 执行的一部分。

> ReplaySubject 记录 Observable 执行中的多个值并将其回放给新的订阅者。

当创建 ReplaySubject 时，你可以指定回放多少个值：
```
var subject = new Rx.ReplaySubject(3); // 为新的订阅者缓冲3个值

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(5);

// 执行结果
observerA: 1
observerA: 2
observerA: 3
observerA: 4
observerB: 2
observerB: 3
observerB: 4
observerA: 5
observerB: 5
```
除了缓冲数量，你还可以指定 window time (以毫秒为单位)来确定多久之前的值可以记录。在下面的示例中，我们使用了较大的缓存数量100，但 window time 参数只设置了500毫秒。

### AsyncSubject
AsyncSubject 是另一个 Subject 变体，只有当 Observable 执行完成时(执行 complete())，它才会将执行的最后一个值发送给观察者。

```
var subject = new Rx.AsyncSubject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(5);
subject.complete();

// 输出
observerA: 5
observerB: 5
```
AsyncSubject 和 last() 操作符类似，因为它也是等待 complete 通知，以发送一个单个值。

## Operators (操作符)
尽管 RxJS 的根基是 Observable，但最有用的还是它的操作符。操作符是允许复杂的异步代码以声明式的方式进行轻松组合的基础代码单元。

### 什么是操作符？
操作符是 Observable 类型上的方法，比如 .map(...)、.filter(...)、.merge(...)，等等。当操作符被调用时，它们不会改变已经存在的 Observable 实例。相反，它们返回一个新的 Observable ，它的 subscription 逻辑基于第一个 Observable 。

> 操作符是函数，它基于当前的 Observable 创建一个新的 Observable。这是一个无副作用的操作：前面的 Observable 保持不变。

操作符本质上是一个纯函数 (pure function)，它接收一个 Observable 作为输入，并生成一个新的 Observable 作为输出。订阅输出 Observalbe 同样会订阅输入 Observable 。
```
function multiplyByTen(input) {
  var output = Rx.Observable.create(function subscribe(observer) {
    input.subscribe({
      next: (v) => observer.next(10 * v),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
  return output;
}

var input = Rx.Observable.from([1, 2, 3, 4]);
var output = multiplyByTen(input);
output.subscribe(x => console.log(x));
```
*订阅 output 会导致 input Observable 也被订阅。我们称之为“操作符订阅链”*

### 实例操作符和静态操作符
`什么是实例操作符？` 通常提到操作符时，我们指的是实例操作符，它是 Observable 实例上的方法。举例来说，如果上面的 multiplyByTen 是官方提供的实例操作符，它看起来大致是这个样子的：

```
Rx.Observable.prototype.multiplyByTen = function multiplyByTen() {
  var input = this;
  return Rx.Observable.create(function subscribe(observer) {
    input.subscribe({
      next: (v) => observer.next(10 * v),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
}
```
> 实例运算符是使用 this 关键字来指代输入的 Observable 的函数。

```
var observable = Rx.Observable.from([1, 2, 3, 4]).multiplyByTen();
observable.subscribe(x => console.log(x));
```

`什么是静态操作符？`  除了实例操作符，还有静态操作符，它们是直接附加到 Observable 类上的。静态操作符在内部不使用 this 关键字，而是完全依赖于它的参数。

> 静态操作符是附加到 Observalbe 类上的纯函数，通常用来从头开始创建 Observalbe 。

最常用的静态操作符类型是所谓的创建操作符。它们只接收非 Observable 参数，比如数字，然后创建一个新的 Observable ，而不是将一个输入 Observable 转换为输出 Observable 。

interval函数：接收一个数字(非 Observable)作为参数，并生产一个 Observable 作为输出。

```
var observable = Rx.Observable.interval(1000 /* 毫秒数 */);
```
create函数。

然而，有些静态操作符可能不同于简单的创建。一些`组合操作符`可能是静态的，比如 merge、combineLatest、concat，等等。这些作为静态运算符是有道理的，因为它们将多个Observables作为输入，而不仅仅是一个，例如：

```
var observable1 = Rx.Observable.interval(1000);
var observable2 = Rx.Observable.interval(400);

var merged = Rx.Observable.merge(observable1, observable2);
```
### Marble diagrams (弹珠图)

> 在弹珠图中，时间流向右边，图描述了在 Observable 执行中值(“弹珠”)是如何发出的。

![弹珠图](http://ww1.sinaimg.cn/large/8b2b1aafly1fsjxrgmgrtj20jg0b0q41.jpg)

### 操作符分类
创建、转换、过滤、组合、错误处理、工具，等等。。。


