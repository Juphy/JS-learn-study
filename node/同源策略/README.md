### 同源

- 协议相同
- 域名相同
- 端口相同
  同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。

### Cookie

`Cookie`是服务器写入浏览器的一小段信息，只有同源的网页才能共享。但是，两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置`document.domain`共享`Cookie`。
`Set-Cookie: key=value; domain=.example.com; path=/`
这种方法只适用于 Cookie 和 iframe 窗口，LocalStorage 和 IndexDB 无法通过这种方法，规避同源政策。

### iframe

如果两个网页不同源，就无法拿到对象的 DOM。如果两个窗口一级域名相同，只是二级域名不同，那么设置上一节介绍的 document.domain 属性，就可以规避同源政策，拿到 DOM。
对于完全不同源的网站，目前有三种方法，可以解决跨域窗口的通信问题。

- 片段识别符（fragment identifier）
- window.name
- 跨文档通信 API（Cros-document messaging）

#### window.postMessage

HTML5 为了解决这个问题，引入了一个全新的 API：跨文档通信 API（Cross-document messaging）。
window 对象新增了一个 window.postMessage 方法，允许跨窗口通信，不论这两个窗口是否同源。
postMessage 方法的第一个参数是具体的信息内容，第二个参数是接收消息的窗口的源（origin），
即"协议 + 域名 + 端口"。也可以设为\*，表示不限制域名，向所有窗口发送。

### LocalStorage

通过 window.postMessage，读写其他窗口的 LocalStorage 也成为了可能。

### AJAX

> JSONP

JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，老式浏览器全部支持，服务器改造非常小。
网页通过添加一个`<script>`元素，向服务器请求 JSON 数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

> WebSocket

WebSocket 是一种通信协议，使用 ws://（非加密）和 wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

> cors

```JS
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

浏览器将 CORS 请求分成两类：简单请求和非简单请求。对于简单请求，浏览器直接发出 CORS 请求。就是会在头信息之中，增加一个 Origin 字段。Origin 字段用来说明本次请求来自哪个源。服务器根据这个值，决定是否同意这次请求。对于如果 Origin 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含 Access-Control-Allow-Origin 字段，就知道出错了，从而抛出一个错误，ajax 不会收到响应信息。如果成功的话会包含一些以 Access-Control- 开头的字段。

### fill

fill(value, start, end): [start, end) 默认值[0, this.length)
方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

### Object.is()

```JS
Object.is(NaN, NaN) // true
Object.is(+0, -0) // false
```

### 内存泄漏

1. 意外的全局变量
2. 被遗忘的计时器或回调函数
3. 脱离 DOM 的引用
4. 闭包

### call, apply, bind

```JS
Function.prototype.call = function(){
  // 判断调用对象
  if(typeof this!=='function'){
    throw new Error('Type Error');
    return;
  }
  arguments = Array.slice.call(arguments);
  let context = [...arguments].slice(0, 1) || window, // 判断context是否传入，如果未传入则设置为window
      args = [...arguments].slice(1),
      result = null;
  context.fn = this;
  result = context.fn(...args);
  delete context.fn;
  return result;
}

Function.prototype.apply = function(){
  if(typeof this !== 'function'){
    throw new Error('Type Error');
    return;
  }
  arguments = Array.prototype.slice.call(arguments);
  let context = arguments[0],
      args = arguments.slice(1),
      result = null;
  context.fn = this;
  result = context.fn(...args)
  delete context.fn;
  return result;
}

Function.prototype.bind = function(){
    if(typeof this !== 'function'){
    return throw new Error('Type Error');
    arguments = Array.prototype.slice.call(arguments);
    let context = arguments[0],
        args = arguments.slice(1),
        fn = this;
    return function(){
      fn.apply(context, args);
    }
  }
}
```
