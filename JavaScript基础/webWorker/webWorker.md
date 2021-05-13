### Web Worker
JavaScript语言采用的单线程模型，所有的任务只能在一个线程上完成，一次只能做一件事，多核CPU的出现，单线程带来了很大的不便，无法充分发挥计算机的能力。
Web Worker的作用就是为JavaScript创造多线程环境，允许主线程创建Worker线程，将一些任务分配给后者运行，在主线程运行的同时，Worker线程在后台运行，两者互不干扰。等Worker线程完成计算任务，再把结果返回给主线程。
Worker线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断，这样有利于随时响应主线程的通信，但是这也造成了Worker比较耗费资源，不应该过度使用。

> 同源限制：分配给worker线程运行的脚本文件，必须与主线程的脚本文件同源

> DOM限制：Worker线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的DOM对象，也无法使用`document`，`window`，`parent`这些对象，但是，Worker线程可以使用navigator对象和location对象。

> 通信联系：Worker线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

> 脚本限制：Worker线程不能执行`alert()`方法和`confirm()`方法，但可以使用XMLHttpRequest对象发出AJAX请求。

> 文件限制：Worker线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

#### 主线程
```
var worker = new Worker('work.js');
```
`Worker()`构造函数的参数是一个脚本文件，该文件就是Worker线程所要执行的任务。由于Worker不能读取本地文件，所以这个脚本必须来自网络。如果下载没有成功（比如404错误），worker就会默认失败。

然后，主线程调用`worker.postMessage()`方法，向Worker发消息。
```
worker.postMessage('Hello World');
worker.postMessage({ method: 'echo', args: ['Work'] });
```
`worker.postMessage()`方法的参数，就是主线程传给Worker的数据。它可以是各种数据类型，包括二进制数据。

接着，主线程通过`worker.onmessage`指定监听函数，接收子线程发回来的消息。
```
worker.onmessage = function(event){
    console.log("Received message "+event.data);
    doSomething();
}
function doSomething(){
    // 执行操作
    worker.postMessage('Work done!');
}
```
事件对象的`data`属性可以获取Worker发来的数据。
Worker完成任务之后，主线程就可以把它关掉。
```
worker.terminate();
```