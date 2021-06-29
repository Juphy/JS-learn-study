Javascript is a single threaded single concurrent language,meaning it can handle one task at a time or a piece of code at a time.It has a single call stack which along with other parts like heap,queue constitutes the Javascript Concurrency Model(implemented inside of V8).

![js堆栈模型](https://ww1.sinaimg.cn/large/8b2b1aafly1fwdcwa7tzwj208b07n0sl.jpg)


### call stack
解析器的一种机制，可以在脚本调用多个函数时，跟踪每个函数在完成执行时应该返回空值的位置。（什么函数在执行，什么函数被调用，以及下一个调用的函数）

记录函数调用的数据结构，基于程序中的位置，如果我们调用一个函数来执行，我们将一些东西推送到堆栈，当函数返回的时候，我们就从堆栈的顶部弹出。

通过抛出错误，在浏览器控制台可以看到红色错误堆栈跟踪，它基本上表示调用堆栈的当前状态以及函数在哪里失败，从上到下的方式就像堆栈一样。

对于chrome浏览器，堆栈的大小有16000帧的限制，超过它就会kil things并抛出Max Stack Error Reached的错误。

特点：
- It is single-threaded.Meaning it can only do one thing at a time.
- Code execution is synchronous.
- A function invocation creates as stack frame that occupies a temporary memory.
- It works as a LIFO - Last In, First Out data structure.

### heap
对象分配在堆中，即大部分非结构化的内存，这里发生了对变量和对象的所有内存分配。

### queue
javascript运行时包含一个消息队列，它是要处理的消息列表以及要执行的关联函数列表。当堆栈具有足够多的容量的时候，就会熊队列取出消息并处理，该消息包括调用关联函数（从而创建初始堆栈帧）。当堆栈再次变空，消息执行结束。基本上来说，在给定回调函数的情况下，这些被队列的消息会来响应外部异步事件（列如，鼠标点击事件或者对http请求的响应）。

### Event Loop
事实上，当我们评估JS代码性能的时候，堆栈中的函数会使其变慢或者变快。console.log()是很快的但是使用for或者while数千或数百万个执行将会很慢，并且会保持堆栈的占用或者阻塞。

网络请求可能很慢，图片请求可能很慢，但是幸运的是服务器请求可以通过ajax完成，这是一个异步函数。Javascript是单线程语言，除非栈内的函数已经返回一个值，否则这是不可能的。

最简单的解决方法就是使用异步回调，这意味着我们运行一部分代码并给它一个稍后将要执行的回调函数。我们必须选择异步回调，就像使用$.get()，setTimeout()，setInterval()，Promise()，etc。所有的这些异步回调都没有立即执行，并且会在一段时间后运行，因此不能立即在堆栈内推送，这与同步函数不同。

Browser Web APIs-threads created by browser implemented in C++ to handle async events like DOM events, http request, setTimeout, etc.

这些WebAPI本身不能将执行代码放到堆栈上，如果确实如此，那么它会随机出现在代码的中间。任何WebAPI在完成执行后将回调推送到此队列。现在，Event Loop负责在队列。

*JS是单线程语言，JS的event loop是JS的执行机制。*
- JS为什么是单线程？：与它的用途有关，作为浏览器脚本语言，js的主要用途是与用户互动，以及操作dom。
（为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。）
- JS为什么需要异步？：如果不存在异步，会导致代码阻塞，程序卡死。
- 单线程如何实现异步操作？：通过事件循环（event loop）。

### Javascript执行环境（Runtime）和执行引擎（Engine）
引擎指的是虚拟机，于Node来说是V8、对Chrome来说是V8、对Safari来说JavaScript Core，对Firefox来说是SpiderMonkey。JavaScript的执行环境很多，上面说的各种浏览器、Node、Ringo等。
Engine的目的是要实现ECMAScript的标准，不关心什么是event loop，准确的讲应该是Runtime的执行机制。

### 任务队列
> 同步任务（synchronous）：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务

> 异步任务（asynchronous）：不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

Event Loop是实现异步的一种机制，一般而言，操作分为：发出调用和得到结果两步。发出调用，立即得到结果是为同步，但无法立即得到结果，需要额外的操作才能得到预期的结果是为异步。同步就是调用之后一直等待，直至返回结果。异步则是调用之后，不能直接拿到结果，通过一系列的手段（也就是实现一步的方法，其中包括event loop，以及轮询（所谓轮询：就是一直询问的方式）、事件（所谓事件：就是不用不停地询问当完成之后主动通知）等）才最终拿到结果（调用之后，拿到结果中间的时间可以介入其他任务）。

![主线程和任务队列](https://ws1.sinaimg.cn/large/8b2b1aafly1fymoytocrij20g50boq3q.jpg)
（1）所有任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。系统把异步任务放到"任务队列"之中，然后继续执行后续的任务。

（3）一旦"执行栈"中的所有任务执行完毕，系统就会读取"任务队列"。如果这个时候，异步任务已经结束了等待状态，就会从"任务队列"进入执行栈，恢复执行。

（4）主线程不断重复上面的第三步。

### 事件和回调函数
"任务队列"就是主线程上的一切调用，所谓的事件驱动，就是将一切抽象为事件，IO操作完成是一个事件，用户点击一次鼠标是事件，Ajax完成了是一个事件，一个图片加载完成是一个事件。一个任务不一定产生事件，比如获取当前时间。当产生事件后，这个时间会被放进队列，等待被处理。

异步任务不一定要回调函数，主线程永远在执行中，主线程会不断检查事件队列。先产生的事件，先被处理，永远在主线程上，没有返回主线程之说，某些事件也不是必须要在规定的时间执行，有时候没有办法在规定的时间执行。

### Event Loop
事件驱动的的实现过程主要靠事件循环完成。进程启动后就进入主循环。主循环的过程就是不停的从事件队列里读取事件。如果事件有关联的handle(也就是注册的callback)，就执行handle。一个事件并不一定有callback。
![event loop](https://ws1.sinaimg.cn/large/8b2b1aafly1fymawsf734j20gp0endg6.jpg)

主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码调用各种外部API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

执行栈中的代码（同步任务），总是在读取"任务队列"（异步任务）之前执行。

### 定时器
setTimeout(fn,0)指的是某个任务在主线程最早可得的空闲时间，尽可能早的执行。它在"任务队列"的尾部添加一个事件，因此要等到同步任务和"任务队列"现有的事件都处理完，才会得到执行。

setTimeout()只是将事件插入了"任务队列"，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证回调函数一定会在setTimeout()指定的时间执行。

定时器并不是特例。到达时间点后，会形成一个事件（timeout事件）。不同的是一般事件是靠底层系统或者线程池之类的产生事件，但定时器事件是靠事件循环不停检查系统时间来判定是否到达时间点来产生事件。

### nodejs的event loop
![event loop](https://ws1.sinaimg.cn/large/8b2b1aafly1fymbetug3wj20m808saad.jpg)

只有磁盘IO操作才用到了线程池（unix）。
Node中，磁盘I/O的异步操作步骤如下：
- 将调用封装成中间对象，交给event loop，然后直接返回
- 中间对象会被丢进线程池，等待执行
- 执行完成后，会将数据放进事件队列中，形成事件
- 循环执行，处理事件。拿到事件的关联函数（callback）和数据，将其执行
- 然后下一个事件，继续循环

> process.nextTick

在当前“执行栈”的尾部及下一次event loop（主线程读取“任务队列”）之前，触发函数。如果有多个process.nextTick（不管他们是否嵌套），将全部在当前“执行栈”执行完后执行。process.nextTick嵌套时，外层先执行，内层后执行。

> setImmediate

在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像。虽然两者都是在下一次Event Loop触发，但是那个回调先执行是不确定。[详见代码](./定时器.js)

使用事件驱动的系统中，必然有非常非常多的事件。如果事件都产生，都要主循环去处理，必然会导致主线程繁忙。那对于应用层的代码而言，肯定有很多不关心的事件（比如只关心点击事件，不关心定时器事件）。这会导致一定浪费。因此，还有一个watcher，观察者。事实上，不是所有的事件都放置在一个队列里。不同的事件，放置在不同的队列。

当我们没有使用定时器时，则完全不用关心定时器事件这个队列。当我们进行定时器调用时，首先会设置一个定时器watcher。事件循环的过程中，会去调用该watcher，检查它的事件队列上是否产生事件（比对时间的方式）。当我们进行磁盘IO的时候，则首先设置一个io watcher，磁盘IO完成后，会在该io watcher的事件队列上添加一个事件。事件循环的过程中从该watcher上处理事件。处理完已有的事件后，处理下一个watcher。检查完所有watcher后，进入下一轮检查。对某类事件不关心时，则没有相关watcher。

### 执行机制
> macro-task（宏任务）：包括整体代码script，setTimeout，setInterval，async, new Promise()resolve之前的内容

> micro-task（微任务）：Promise，process.nextTick（当前loop宏任务结束之后最先执行，先于promise的then执行）

> async中的await fn().then()此处相当于promise的then，在这之后的代码是在本次loop的最后执行。

因此代码整体的运行顺序，script(主程序代码，new Promise(……)，async函数的await之前的部分包括函数本身)—> process.nextTick—>promise().then—>async function(){await fn();……}省略号处的代码—>setTimeout/setInterval

![event_loop](https://ws1.sinaimg.cn/large/8b2b1aafly1fyma0l75shj20m80ia793.jpg)

JS的执行机制：
- 执行一个宏任务，过程中如果遇到微任务，就将其放到微任务的事件队列里
- 当前宏任务执行完成后，会查看微任务的事件队列，并将里面全部的微任务依次执行完

```
 setTimeout(function(){
     console.log('定时器开始啦')
 });

 new Promise(function(resolve){
     console.log('马上执行for循环啦');
     for(var i = 0; i < 10000; i++){
         i == 99 && resolve();
     }
 }).then(function(){
     console.log('执行then函数啦')
 });

 console.log('代码执行结束');
```
首先执行script下的宏任务，遇到setTimeout，将其放到宏任务的【队列】里，遇到new Promise直接执行，打印；遇到then方法，是微任务，将其放到微任务的【队列】里，打印；本轮宏任务执行完毕，查看本轮的微任务，发现有一个then方法里的函数，打印；至此，本轮的event loop全部完成。下一轮的循环里，先执行一个宏任务，发现宏任务的【队列】里有一个setTimeout里的函数，打印。

[详见代码](./await和promise.js)


