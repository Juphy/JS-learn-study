### Hot vs Cold Observables
- Cold Observable在订阅开始运行前即当调用Subscribe时，observable才开始向观察者推送值。
    - 在内部创建生产者？
    - 1、创建生产者
    - 2、激活生产者
    - 3、开始监听生产者
    - 4、单播
- Hot Observable在订阅激活之前已经产生值了。
    - 在外部创建生产者
    - 1、共享生产者的引用
    - 2、开始监听生产者
    - 3、多播
```
let obs = Rx.Observable.create(observer => observer.next(1))
obs.subscribe(v => console.log('A'+v)); // A1
obs.subscribe(v => console.log('B'+v)); // B1
```
如果用Date.now()来代替1的话，会得到不同的值，因此Observable开始每次订阅时才生成值，这是cold observable。

### Making Cold Observables Hot
```
let obs = Rx.Observable
            .create(observer => observer.next(Date.now()))
            .publish();
obs.subscribe(v => console.log("1st subscriber: " + v));
obs.subscribe(v => console.log("2nd subscriber: " + v));
obs.connect();
=>
1st subscriber: 1465994477014
2nd subscriber: 1465994477014
```
通过connect在订阅之前移动呼叫来解决在它订阅之前没有开始产生价值。
publish的作用：（第二个订阅没有从0开始）
```
let obs = Rx.Observable
            .interval(1000)
            .publish()
            .refCount();

obs.subscribe(v => console.log("1st subscriber:" + v));
setTimeout(()
  => obs.subscribe(v => console.log("2nd subscriber:" + v)), 1100);
Ouptut：
1st subscriber:0
1st subscriber:1
2nd subscriber:1
1st subscriber:2
2nd subscriber:2
```
- interval(1000)创建Observable，每秒都会发出一个从索引值开始增加的索引值0
- publish用来分享几个订阅的价值生产者
-第二次订阅推迟一秒钟

### publish、refCount、connect
```
let obs = Rx.Observable
            .interval(1000)
            .publish()
            .refCount();

setTimeout(() => {
  // delay both subscriptions by 2 seconds
  obs.subscribe(v => console.log("1st subscriber:" + v));
  setTimeout(
    // delay for a little more than a second and then add second subscriber
    () => obs.subscribe(
          v => console.log("2nd subscriber:" + v)), 1100);

},2000);

Ouptut：
1st subscriber:0
1st subscriber:1
2nd subscriber:1
1st subscriber:2
2nd subscriber:2
```
这是一个相当温暖但还不是非常热的Observable，这是因为工作方式refCount。publish操作者创建ConnectableObservable，这意味着它创建一个可观察的observable是共享一个单一订阅基础源，但是publish尚未订阅基础的资源。它更像是一个守门人，可以确保订阅不是针对底层来源而是针对ConnectableObservable相反的来源。

connect的工作事件上是ConnectableObservable让订阅源底层产生值的东西，refCount是一个运营商，该运营商在第一个订阅时立即建立connect并导致ConnectableObservable订购底层源，并且一旦没有订户就立即取消订阅，他只是在跟踪有多少订阅ConnectableObservable。

如果想让observable真正的hot，可以尽早调用connect。
```
let obs = Rx.Observable.interval(1000).publish();
obs.connect();
setTimeout(() =>{
    obs.subscribe(v =>console.log('1st subscribe: '+v));
    setTimeout(() => obs.subscribe(v => console.log('2nd subscribe:'+v)), 1000);
}, 2000);
output: 
1st subscriber:2
1st subscriber:3
2nd subscriber:3
```
当publish和refCount一起调用时，就相当于share。在具有默认值的流上使用多个异步管道，.share()运算符可能会导致问题，在share()将发布第一个订阅上的数据流的第一个值，第一个异步管道将触发该订阅并获取该初始值，然而，第二个异步管道将在已经发出该值之后订阅，因此错过该值。

结局方案：shareReplay(1)将跟踪流的先前值，这样所有异步管道都将获得最后一个值，就像share()是publish().refCount()，shareReplay(1)就是publishReplay(1).refCount()。