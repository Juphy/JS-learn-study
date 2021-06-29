### Event Loop 是什么？

Event Loop 是一个执行模型，在不同的地方有不同的实现。浏览器和 NodeJS 基于不同的技术实现了自己的 Event Loop。

- 浏览器的 Event Loop 是在[html5 的规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)中明确定义。
- NodeJS 的 Event Loop 是基于 libuv 实现的。可以参考 Node 的[官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)以及 libuv 的[官方文档](http://docs.libuv.org/en/v1.x/design.html)。
- libuv 已经对 Event Loop 做出了实现，而 HTML5 规范中只是定义了浏览器中 Event Loop 的模型，具体的实现留给了浏览器厂商。

### 宏队列和微队列
`宏队列，macrotask，也叫tasks`。一些异步任务的回调一次进入macro task queue,等待后续被调用，这些异步任务包括：
- setTimeout/setInterval
- setImmediate(Node独有)
- requestAnimationFrame(浏览器独有)
- I/O
- UI rendering(浏览器独有)

`微队列，microtask, 也叫jobs`。另一些异步任务的回调回一次进入micro task queue，等待后续被调用，这些任务包括：
- process.nextTick(Node独有)
- Promise
- Object.observe
- MutationObserver

####
[123](https://segmentfault.com/a/1190000016278115)