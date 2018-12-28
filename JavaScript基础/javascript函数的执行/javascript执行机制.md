Javascript is a single threaded single concurrent language,meaning it can handle one task at a time or a piece of code at a time.It has a single call stack which along with other parts like heap,queue constitutes the Javascript Concurrency Model(implemented inside of V8).

![js堆栈模型](http://ww1.sinaimg.cn/large/8b2b1aafly1fwdcwa7tzwj208b07n0sl.jpg)


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

网络请求可能很慢，图片请求可能很慢，但是幸运的是服务器请求看可以通过ajax完成，这是一个异步函数。Javascript是单线程语言，除非栈内的函数已经返回一个值，否则这是不可能的。

最简单的解决方法就是使用异步回调，这意味着我们运行一部分代码并给它一个稍后将要执行的回调函数。我们必须选择异步回调，就像使用$.get()，setTimeout()，setInterval()，Promise()，etc。所有的这些异步回调都没有立即执行，并且会在一段时间后运行，因此不能立即在堆栈内推送，这与同步函数不同。

Browser Web APIs-threads created by browser implemented in C++ to handle async events like DOM events, http request, setTimeout, etc.

这些WebAPI本身不能将执行代码放到堆栈上，如果确实如此，那么它会随机出现在代码的中间。任何WebAPI在完成执行后将回调推送到此队列。现在，Event Loop负责在队列。




