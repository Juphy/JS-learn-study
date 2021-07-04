### postMessage
对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议、端口号以及主机时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。
- otherWindow.postMessage(message, targetOrigin, [transfer]);
  - otherWindow：其他窗口的一个引用，比如 iframe 的 contentWindow 属性、执行 window.open 返回的窗口对象等。
  - message：将要发送到其他 window 的数据，它将会被结构化克隆算法序列化。
  - targetOrigin：通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串 "*"（表示无限制）或者一个 URI。
  - transfer（可选）：是一串和 message 同时传递的 Transferable 对象。这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

发送方通过 postMessage API 来发送消息，而接收方可以通过监听 message 事件，来添加消息处理回调函数，具体使用方式如下：
```
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  let origin = event.origin || event.originalEvent.origin; 
  if (origin !== "http://semlinker.com") return;
}
```
### Postmate