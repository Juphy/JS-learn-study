> angular中rxjs封装的websocket

```
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;

  constructor() {
  }

 // 发送数据
  send(message: any) {
    this.ws.send(message);
  }

 // 建立连接
  connect(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => {
        console.log(event, '服务器端断开链接！');
        observer.complete();
      };
    });
  }
 // 断开连接
  disconnect() {
    this.ws.close();
    console.log('浏览器端断开链接！');
  }
}

```
## WebSocket
- 特点：
    - 服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。WebSocket 允许服务器端与客户端进行全双工（full-duplex）的通信。
    - 建立在 TCP 协议之上，服务器端的实现比较容易。
    - 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
    - 数据格式比较轻量，性能开销小，通信高效。
    - 可以发送文本，也可以发送二进制数据。
    - 没有同源限制，客户端可以与任意服务器通信，完全可以取代 Ajax。
    - 协议标识符是ws（如果加密，则为wss，对应 HTTPS 协议），服务器网址就是 URL。

### websocket握手
- 浏览器发出：

```
    GET / HTTP/1.1
    Connection: Upgrade
    Upgrade: websocket
    Host: example.com
    Origin: null
    Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
    Sec-WebSocket-Version: 13
```
HTTP1.1 协议规定，Upgrade表示将通信协议从HTTP/1.1转向该字段指定的协议。Connection字段表示浏览器通知服务器，如果可以的话，就升级到 WebSocket 协议。Origin字段用于提供请求发出的域名，供服务器验证是否许可的范围内（服务器也可以不验证）。Sec-WebSocket-Key则是用于握手协议的密钥，是 Base64 编码的16字节随机字符串。

- 服务器响应：

```
    HTTP/1.1 101 Switching Protocols
    Connection: Upgrade
    Upgrade: websocket
    Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
    Sec-WebSocket-Origin: null
    Sec-WebSocket-Location: ws://example.com/
```
服务器同样用Connection字段通知浏览器，需要改变协议。Sec-WebSocket-Accept字段是服务器在浏览器提供的Sec-WebSocket-Key字符串后面，添加“258EAFA5-E914-47DA-95CA-C5AB0DC85B11”字符串，然后再取 SHA-1 的哈希值。浏览器将对这个值进行验证，以证明确实是目标服务器回应了 WebSocket 请求。Sec-WebSocket-Location字段表示进行通信的 WebSocket 网址。

> 完成握手以后，WebSocket 协议就在 TCP 协议之上，开始传送数据。

### 客服端API
- 浏览器对 WebSocket 协议的处理，无非就是三件事。
    - 建立连接和断开连接
    - 发送数据和接收数据
    - 处理错误

1、 构造WebSocket函数
```
var ws = new WebSocket('ws://localhost: 8080');
```
执行上面语句之后，客户端就会与服务器进行连接。

2、webSocket.readyState

- readyState属性返回实例对象的当前状态，共有四种。
    - CONNECTING：值为0，表示正在连接。
    - OPEN：值为1，表示连接成功，可以通信了。
    - CLOSING：值为2，表示连接正在关闭。
    - CLOSED：值为3，表示连接已经关闭，或者打开连接失败。

```
switch (ws.readyState) {
  case WebSocket.CONNECTING:
    // do something
    break;
  case WebSocket.OPEN:
    // do something
    break;
  case WebSocket.CLOSING:
    // do something
    break;
  case WebSocket.CLOSED:
    // do something
    break;
  default:
    // this never happens
    break;
}
```
3、

- webSocket.onopen 用于指定连接成功后的回调函数
- webSocket.onclose 用于指定连接关闭后的回调函数
- webSocket.onmessage 用于指定收到服务器数据后的回调函数
- webSocket.send() 用于向服务器发送数据
- webSocket.bufferedAmount 实例对象的bufferedAmount属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。
- webSocket.onerror


