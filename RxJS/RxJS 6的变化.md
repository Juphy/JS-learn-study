## RxJS 6的向后兼容
为了便捷的从RxJS 5迁移到RxJS 6，可以使用rxjs-compat的软件包，该软件包在V5和V6之间创建一个兼容层。
```
npm i rxjs-compat -S
```
在升级RxJS 6的同时继续运行RxJS 5的代码。
## rxjs-compat升级RxJS的限制
### TypeScript原型操作符
### 同步错误处理

## RxJS 6的变化
### 修改import路径
- rxjs：包含创建方法，类型，调度程序和工具库
```
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
```
- rxjs/operators：包含所有的管道操作符
```
import { map, filter, scan } from 'rxjs/operators';
```
- rxjs/webSocket：包含websocket subject实现
```
import {webSocket} from 'rxjs/webSocket'
```
- rxjs/ajax：包含Rx的ajax
```
import {ajax} from 'rxjs/ajax'
```
- rxjs/testing： 包含RxJS的测试工具库
```
import {TestScheduler}  from 'rxjs/testing'
```
### 使用管道操作符而不是链式操作
使用新的管道操作符语法替换旧有的链式操作，上一个操作符方法的结果会被传递到下一个操作符方法中。

- 从rxjs-operators中引入需要的操作符

> 注意：由于与Javascript保留字冲突，以下运算符名字做了修改：do -> tap, catch -> catchError, swicth -> switchAll, finally -> finalize

```
import {map, filter, catchError, mergeMap} from 'rxjs/operators'
```
- 使用pipe()包裹所有的操作符方法，确保所有的操作符见的`.`被移除，转而使用`,`连接。
```
// an operator chain
source
    .map(x=> x+x)
    .mergeMap(
        n => of(n+1, n+2)
        .filter(x=> x%1==0)
        .scan((acc, x)=> acc+x, 0)
    )
    .catch(err => of('error found'))
    .subscribe(printResult);

// a pipe flow
source.pipe(
    map(x => x+x),
    mergeMap(
        n => of(n+1, n+2)
        .pipe(
            filter(x => x%1==0)，
            scan((acc, x)=> acc+x, 0))
        ),
    catchError(err => of('error found')),
).subscribe(printResult);        
```
### 使用函数而不是类
使用函数而不是类来操作可观察对象（Observable）。所有的Observable类已经被移除
```
// removed
ArrayObservable.create(myArray)

// use instead
from(Array)

// also use
new Operator fromArray()
```
特殊情乱：
> ConnectableObservable在v6中不能直接使用，要访问它，请使用操作符multicast，publish，publishReplay和publishLast
> SubscribeOnObservable在v6中不能直接使用，要访问它，请使用操作符subscribeOn

### 移除resultSelector
对于使用到该功能的开发人员，他们需要将esultSelector参数替换为外部代码。

对于first(), last()这两个函数，这些参数已被移除，在删除rxjs-compat之前务必升级代码。

对于其他拥有resultSelector参数的函数，如mapping操作符，该参数已被弃用，并以其他方式重写。如果您移除rxjs-compat，这些函数仍可正常工作，但是RxJs团队声明他们必须在v7版本发布之前将其移除。

### Observable.if and Observable.throw
Observable.if已被iif()取代，Observable.throw已被throwError()取代。
```
// deprected
Observable.if(test, a$, b$)

// use instead
iif(test, a$, b$)


// deprected
Observable.throw(new Error())

// use instead
throwError(new Error())
```
### 已弃用的方法
- merge
```
import {merge} from 'rxjs/operator';
a$.pipe(merge(b$, c$));

// becomes
import {merge} from 'rxjs'
merge(a$, b$, c$)
```
- concat
```
import { concat } from 'rxjs/operators';
a$.pipe(concat(b$, c$));

// becomes
import { concat } from 'rxjs';
concat(a$, b$, c$);
```
- combineLatest
```
import { combineLatest } from 'rxjs/operators';
a$.pipe(combineLatest(b$, c$));

// becomes
import { combineLatest } from 'rxjs';
combineLatest(a$, b$, c$);
```
- race
```
import { race } from 'rxjs/operators';
a$.pipe(race(b$, c$));

// becomes
import { race } from 'rxjs';
race(a$, b$, c$);
```
- zip
```
import { zip } from 'rxjs/operators';
a$.pipe(zip(b$, c$));

// becomes
import { zip } from 'rxjs';
zip(a$, b$, c$);
```