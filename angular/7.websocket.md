> Angular中rxjs封装的websocket(废弃)

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
> RxJS自带RxJS（v6）

- 接受消息
```
import {webSocket} from "rxjs/webSocket";
const subject = webSocket("ws://localhost:8081");
subject.subscribe(
  msg =>{
    console.log(message); // called whenever there is message from the server
  },
  err =>{
    console.log(err); // called if at any point WebSocket API signals some kind of error
  },
  () => {
    console.log('complete')
  }
)
```
- 传送消息
```
import {webSocket} from "rxjs/webSocket";
const subject = webSocket("ws://localhost:8081");
subject.subscribe();

subject.next(JSON.stringify({message: 'some message'})); // send message to server

subject.complete(); // Closes the connection.
```
- Multiplexing WebSocket（复用websocket）
```
import { webSocket } from "rxjs/websocket";
const subject = webSocket("ws://localhost:8081");

const observableA = subject.multiplex(
  () => JSON.stringify({subscribe: 'A'}), // when server gets this message ,it will start sending message for 'A'
  () => JSON.stringify({unsubscribe: 'A'}), // when gets this one, it will stop
  message => message.type ==='A' // Server will tag all message for "A" with type property.
)

const observableB = subject.multiplex( // the same goes for "B"
  () => JSON.stringify({subscribe: 'B'}),
  () => JSON.stringify({unsubscribe: 'B'}),
  message => message.type === 'B'
)

const subA = observableA.subscribe(messageForA => console.log(messageForA)); // websocket连接已经建立。服务获得'{subscribe: 'A'}'和开始发送信息'A'。记录log

const subB = observableB.subscribe(messageForB => console.log(messageForB));

subB.unsubscribe(); // Message '{"unsubscribe":'B'}' is sent to the server,which stops sending 'B' messages.

subA.unsubscribe(); // Message '{"unsubscribe": "A"}' makes the server stop sending messages for 'A'.

// socket connection closes.
```

### WebSocketSubject（类似于subject）
创建一个Observable，当订阅时，通过subMsg函数向服务器发送由函数定义的消息，以开始通过该服务订阅数据。数据到达后， messageFilter参数将用于为生成的Observable选择适当的数据。当由于取消订阅，完成或错误而发生拆除时，由unsubMsg 参数定义的消息将通过WebSocketSubject发送到服务器。
```
class WebSocketSubject<T> extends AnonymousSubject {
  constructor(urlConfigOrSource: string | WebSocketSubjectConfig<T> | Observable<T>, destination?: Observer<T>)
  _output: Subject<T>
  lift<R>(operator: Operator<T, R>): WebSocketSubject<R>
  multiplex(subMsg: () => any, unsubMsg: () => any, messageFilter: (value: T) => boolean)
  _subscribe(subscriber: Subscriber<T>): Subscription
  unsubscribe()
}
```
#### Constructor
```
constructor(urlConfigOrSource: string | WebSocketSubjectConfig<T> | Observable<T>, destination?: Observer<T>)
```
- urlConfigOrSource  Type: string | WebSocketSubjectConfig | Observable
- destination optional.Default is undefined. Type: Observer.

#### Properties
|Property|Type|Description|
|:---:|:---:|:--:|
|_output|Subject<T>||

#### Methods
- lift
- multiplex
- _subscribe
- unsubscribe

### WebSocketSubjectConfig（创建连接时的参数）
- url: string  （要连接的套接字服务器的URL）
- protocol: ?string | Array`<`string> （用于连接的协议）
- resultSekector: ?(e: MessageEvent) => T
- serializer: ?(value: T)=> WebSocketMessage（用于在将消息发送到服务器之前根据传递的值创建消息的序列化程序。默认为JSON.stringify）
  - 序列化程序允许我们应用自定义序列化策略
  ```
  import {webSocket} from "rxjs/webSocket";
  const subject = webSocket({
    url: 'ws://localhost:8081',
    serializer: msg => JSON.stringify({channel: "webDevelopment", msg: msg})
    // apply any transformation of your choice
  })
  ```
- deserializer: ?(e:MessageEvent)=> T （用于从服务器到达套接字的消息的反序列化程序。默认是JSON.parse）
- openObserver: NextObserver`<`event>  （- 在需要向msSocket发送/接收msgs之前发出某种init任务，或者发送连接成功的通知）
```
  import {webSocket} from "rxjs/webSocket";
  const wsSubject = webSocket({
    url: "ws://localhost:8081",
    openObserver: {
      next: () =>{
        console.log('connection ok')
      }
    }
  })
```
- closeObserver?: NextObserver`<`CloseEvent>
  - 允许在错误提升时设置自定义错误
  ```
  import {webSocket} from "rxjs/webSocket";
  const wsSubject = webSocket({
    url: "ws://localhost:8081",
    closeObserver: {
      next(closeEvent){
        const customError ={code: 666, reason: "Custom evil reason"};
        console.log(`code； ${customErroe.code}, reason: ${customErroe.reason}`)
      }
    }
  })
  ```
- closingObserver?: NextObserver`<`void> （由于取消订阅而即将关闭的观察者）
- WebSocketCtor?: {...}
- binaryType?: 'blob' | 'arraybuffer'  （设置binaryType基础WebSocket的属性）

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

#### 构造WebSocket函数
```
var ws = new WebSocket('ws://localhost: 8080');
```
执行上面语句之后，客户端就会与服务器进行连接。

#### webSocket.readyState

- readyState属性返回实例对象的当前状态，共有四种。
    - CONNECTING：值为0，表示正在连接。
    - OPEN：值为1，表示连接成功，可以通信了。
    - CLOSING：值为2，表示连接正在关闭。
    - CLOSED：值为3，表示连接已经关闭，或者打开连接失败。

```
switch (ws.readyState) {
  case WebSocket.CONNECTING:
  // case 0:
    // do something
    break;
  case WebSocket.OPEN:
  // case 1:
    // do something
    break;
  case WebSocket.CLOSING:
  // case 2:
    // do something
    break;
  case WebSocket.CLOSED:
  // case 3:
    // do something
    break;
  default:
    // this never happens
    break;
}
```
#### webSocket的api

- webSocket.onopen 用于指定连接成功后的回调函数
- webSocket.onclose 用于指定连接关闭后的回调函数
- webSocket.onmessage 用于指定收到服务器数据后的回调函数，服务器数据可能是文本，也可能是二进制数据（blob对象或ArrayBuffer）
- webSocket.send() 用于向服务器发送数据
- webSocket.bufferedAmount 实例对象的bufferedAmount属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。
- webSocket.onerror 用于指定报错时的回调函数


