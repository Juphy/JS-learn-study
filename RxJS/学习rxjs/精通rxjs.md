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

### Operator
Operator是附加在observable上的函数，像map，filter，concatAll。。。所有这些函数都会拿到原本的observable并回传一个新的observable。