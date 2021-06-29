### JS 事件循环

在 js 的运行机制中，主要把任务分成同步任务和异步任务，其中异步任务又分成宏任务和微任务。
JS 运行时分成主线程和调用栈（执行栈），所有的同步任务都会放到调用栈中按照顺序等待主线程依次执行；
而异步任务会在异步任务得到结果后，将注册的回调函数放到异步队列中等待主线程空闲的时候（执行栈被清空）通知调用，将先进入的异步任务放置执行栈中执行。
在执行完成后，在任务队列中删除任务，此时的任务称为宏任务。当执行栈把某个宏任务执行完成后，回去通知微任务队列执行，直到清空微任务队列中的微任务再进行下一次循环。
宏任务：所有的 JS 代码,setTimeout,setInterval，I/O，UIrendering
微任务：promise 的 then,catch,finally, process.nextTick, MutationObserver(监测 DOM 变化)

async/await 的执行顺序：async/await 在底层转换成了 promise 和 then 回调函数。也就是说这是 Promise 的语法糖，每次使用 await，解释器就会创建一个 promise 对象，然后把剩下的 async 函数中的操作放到 then 回调函数中。

