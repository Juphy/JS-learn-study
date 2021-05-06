## Promise

所谓 promise，相当于是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。语法上说，Promise 是一个对象，从它可以获取异步操作的信息。

- 对象的状态不受外界影响。promise 对象代表一个异步操作，有三种状态：pending(进行中)、fulfilled(已成功)、rejected(已失败)。
- 一旦状态改变了。就不会再变了，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。

promise 也有一些缺点，无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。第三，当处于`pending`状态时，无法得知目前进展到哪一个阶段。

### 基本用法

`Promise`构造函数接收一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`，这两个是函数，由 JavaScript 引擎提供，不用自己部署。`resolve`函数的作用是，将`Promise`对象的状态从"未完成"变成“成功”(即 pending 变为 resolved)，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”(即从 pending 变为 rejected)，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```
const promise = new Promise(function(resolve, reject){
    // ... some code
    if(success){
        resolve(value)
    }else{
        reject(error)
    }
})
```

`Promise`实例生成后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。第一个函数是`Promise`对象的状态变为`resolved`时调用，第二个函数是`Promise`对象的状态变为`rejected`时调用。其中，第二个函数是可选的，不一定要提供。

```
promise.then(function(resolve){
    // success
}, function(error){
    // failure
})
```

_调用`resolve`和`reject`并不会终结 Promise 参数函数的执行_

一般来说，调用`resolve`和`reject`以后，Promise 的使命就完成了，后继操作应该放在`then`方法里面，而不应该写在`resolve`和`reject`的后面。

### Promise.prototype.then()

`then`方法是定义在原型对象`Promise.prototype`上的，它的作用是为 Promise 实例添加状态改变时的回调函数。`then`方法的第一个参数是`resolved`状态的回调函数，第二个参数是`rejected`状态的回调函数。

```
getJSON('/post/1.json').then(
    post => getJSON(post.commentURL)
).then(
    comments => console.log('resolved: ', comments),
    err => console.log('rejected: ', err)
)
```

### Promise.prototype.catch()

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```
getJSON('/post.json').then(function(posts){
    // ...
}).catch(function(error){
    // 处理getJSON和前一个回调函数运行时发生的错误
    console.log('发生错误！', error);
})
```

一个 Promise 对象，如果该对象状态变为 resolved，则会调用 then()方法指定的回调函数；如果异步操作抛出错误，状态就会变为 rejected，就会调用 catch()方法指定的回调函数，处理这个错误。另外，then()方法指定的回调函数，如果运行中抛出错误，也会被 catch()方法捕获。

Promise 对象的错误具有"冒泡"性质，会一直向后传递，直到被捕获为止，也就是说，错误总是会被洗一个`catch`语句捕获。

一般来说，不要在`then()`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

```
// bad
promise.then(function(data){
    // success
}, function(err){
    // error
})

// good
promise.then(function(data){
    // success
}).catch(function(err){
    // error
})
```

与传统的`try/catch`代码块不同的是，如果没有使用`catch()`方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。Promise 内部的错误不会影响到 Promise 外部的代码，通缩的说法就是"Promise 会吃掉错误"

Nodejs 有一个`unhandleRejection`事件，专门监听未捕获的`reject`错误，上面的脚本会触发这个事件的监听函数，可以在监听函数里面抛出错误。`unhandleRejection`事件的监听函数有两个参数，第一个是错误对象，第二个是报错的 Promise 实例，它可以用来了解发生错误的环境信息。

```
process.on('unhandleRejection', function(err, p){
    throw err;
})
```






### Promise.prototype.finally()

### Promise.all()
用于将多个Promise实例，包装成一个新的Promise实例。
`Promise.all()`方法的参数可以不是数组，但必须具有Iterator接口，且返回的每个成员都是Promise实例。
```
const p = Promise.all([p1, p2, p3]);
```
p的状态有p1、p2、p3决定，分成两种情况：
- 只有p1、p2、p3的状态都变成`fulfilled`，p的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
- 只有p1、p2、p3之中有一个被`rejected`，`p`的状态就变成了`rejected`，此时第一个被`rejected`的实例的返回值，会传递给`p`的回调函数。
```
// 生成一个Promise对象的数组
const promises = [2,3,5,7,11,13].map(function(id){
    return getJSON(`/post/${id}.json`);
})
Promise.all(promises).then(function(post){
    //...
}).catch(function(reason){
    //...
})
```
> 如果作为参数的Promise的实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法。

```
const p1 = new Promise((resolve, reject)=>{
    resolve('hello')
})
.then(result => result)
.catch(e => e)

const p2 = new Promise((resolve, reject)=>{
    throw new Error('报错了')
})
.then(result => result)
.catch(e => e)

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e))
// ["hello", Error: 报错了]
```

> 如果p2没有自己的`catch`方法，就会调用`Promise.all()`的`catch`方法

```
const p1 =  new Promise((resolve, reject)=>{
    resolve('hello')
})
.then(result => result)

const p2 = new Promise((resolve, reject)=>{
    throw new Error('报错了')
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e))
```
### Promise.race()
将多个Promise实例，包装成一个新的Promise实例。
```
const p = Promise.race([p1, p2, p3]);
```
**只要`p1`, `p2`, `p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。率先改变的Promise实例的返回值，就传递给`p`的回调函数。**
`Promise.race()`方法的参数与`Promise.all()`方法一样，如果不是Promise实例，就先调用`Promise.resolve()`方法，将参数转为Promise实例，再进一步处理。
```
const p = Promise.race([
    fetch('/resource-that-may-take-a-while'),
    new Promise(function(resolve, reject){
        setTimeout(() => reject(new Error('request timeout')), 5000)
    })
])
p.then(console.log).catch(console.error)
```

### Promise.allSettled()
`Promise.allSettled()`方法接受一组Promise实例作为参数，包装成一个新的Promise实例。只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。
```
const promises = [
    fetch('/api-1'),
    fetch('/api-2'),
    fetch('/api-3')
];
await Promise.allSettled(promise);

```



### Promise.allSettled()

### Promise.any()