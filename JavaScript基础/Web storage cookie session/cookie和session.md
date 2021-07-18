### HTTP
超文本传输协议是一种用于分布式、协作式和超媒体信息系统的应用层协议。HTTP是万维网的数据通信的基础，设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。通过HTTP或者HTTPS协议请求的资源由统一资源标识符（Uniform Resource Identifiers，URI）来标识。

HTTP是无状态协议，说明它不能以状态来区分和管理请求和响应，也就是说，服务器单从网络连接上无从知道客户身份。`这就需要给客户端们颁发一个通行证吗，每人一个，无论谁访问都必须携带自己通行证，这样服务器就能从通行证上确认客户身份了。`这就是Cookie的工作原理。

### Cookie
Cookie是客户端保存用户信息的一种机制，用来记录用户的一些信息，实际上Cookie是服务器保存在浏览器的一小段文本信息，每个 Cookie 的大小一般不能超过4KB，并随着每次请求发送到服务器。

`Cookie技术通过请求和响应报文中写入Cookie信息来控制客户端的状态。`

Cookie会根据响应报文里的一个Set-Cookie的首部字段信息，通知客户端保存Cookie。当下客户端再向服务端发起请求时，客户端会自动在请求报文中加入Cookie值之后发送出去。

之后服务端发现客户端发送过来的Cookie之后，会检查是那个客户端发送过来的请求，然后对服务器上的记录，最后得到了之前的状态信息。
![cookie1](../assets/images/cookie1.jpg)

客户端保存了Cookie之后发起请求：
![cookie2](../assets/images/cookie2.jpg)

> 工作原理
1.创建cookie

当用户第一次浏览某个使用cookie的网站时，该网站的服务器就进行如下的工作：
- 该用户生成唯一的识别码（Cookie ID），创建一个Cookie对象。
- 默认情况下它是一个会话级别的cookie，存储在浏览器的内存中，用户退出浏览器之后被删除，如果网站希望浏览器将该Cookie存储在磁盘上，则需要设置最大时效（maxAge）,并给出一个以秒为单位的时间（将最大时效设为0则是命令浏览器删除该cookie）
- 将cookie放入到HTTP请求报头，将Cookie插入到一个Set-Cookie HTTP响应报头中
- 发送该HTTP响应报文

2.设置存储Cookie

浏览器收到该响应报文之后，根据报文头里的Set-Cookie特殊的指示，生成相应的Cookie，保存在客户端。

3.发送Cookie

当用户再次访问该网站时，浏览器首先检查所有存储的Cookies，如果某个存在该网站的Cookie（即该Cookie所声明的作用范围大于等于将要请求的资源），则把该Cookie附在请求资源的HTTP请求头上发送给服务器。

4.读取Cookie

服务器接收到用户的HTTP请求报文后，从报文头获取到该用户的Cookie，从里面找到所需要的东西。

> Set-Cookie
```
Set-Cookie: logcookie=3qjj; expires=Wed, 13-Mar-2019 12:08:53 GMT; Max-Age=31536000; path=/;
 domain=fafa.com;secure; HttpOnly;
```
1.`logcookie=3qjj`赋予Cookie的名称和值，logcookie是名字，3qjj是值。Cookie可以包含多个字段，使用`;`分隔。`Set-Cookie: name=value;name2=value2;name3=value3`
2.`expires`是设置cookie有效期的UTC格式，可以使用Date.prototype.toUTCString()进行日期格式转换。当省略expires属性时或者设置为null，Cookie只在当前会话（session）有效，浏览器窗口一旦关闭，当前Session结束，该Cookie就会被删除。删除一个现存 Cookie 的唯一方法，是设置它的expires属性为一个过去的日期。
3.`Max-Age`属性指定从现在开始Cookie存在的秒数。如果同时指定了`Expires`和`Max-Age`，那么`Max-Age`的值将优先生效。如果Set-Cookie字段没有指定Expires或Max-Age属性，那么这个 Cookie 就是 Session Cookie，即它只在本次对话存在，一旦用户关闭浏览器，浏览器就不会再保留这个 Cookie。
4.`path`是限制指定Cookie的发送范围的文件目录。`/`表示这个Cookie对该域名的根路径和它的所有子路径都有效，如果路径为`/formus`，那么这个Cookie只有在访问`www.fafa.com/formus`及其子路径时才有效。`path`必须是绝对路径，默认为当前路径。
5.`domain`通过domain属性指定的域名可以做到与结尾匹配一致。比如，指定domain是fafa.com，除了fafa.com，www.fafa.com等都可以发送Cookie。
6.`secure`设置web页面只有在HTTPS安全连接时，才可以发送Cookie。HHTP则不可以进行回收。
7.`HttpOnly`使JavaScript脚本无法获得Cookie，主要是`Document.cookie`属性、XMLHttpRequest对象和RequestAPI都得不到该属性。只有浏览器发出 HTTP 请求时，才会带上该 Cookie。

> document.cookie

`document.cookie`属性用于读写当前网页的所有Cookie，前提是该Cookie不能有`HTTPOnly`属性。`document.cookie`属性是可写的，可以通过它为当前网站添加Cookie。写入的时候，Cookie的值必须写成`key=value`的形式。注意，等号两边不能有空格，另外，写入Cookie，必须对分号、逗号和空格进行转义（它们都不允许作为Cookie的值），这可以用`encodeURIComponent`方法做到。

`document.cookie`读写行为的差异（一次可以读出全部Cookie，但是只能写入一个Cookie），与HTTP协议的Cookie通信格式有关。浏览器向服务器发送Cookie的时候，`Cookie`字段是使用一行将所有Cookie全部发送；服务器向浏览器设置Cookie的时候，`Set-Cookie`字段是一行设置一个Cookie。

写入Cookie的时候，可以一起写入Cookie的属性。
```
document.cookie = "foo=bar; expires=Fri, 31 Dec 2020 23:59:59 GMT";

document.cookie = 'fontSize=14; '
  + 'expires=' + someDate.toGMTString() + '; '
  + 'path=/subdirectory; '
  + 'domain=*.example.com';
```
写入Cookie的时候，同时设置了`expires`属性。属性值的等号两边，也是不能有空格的。

浏览器可以设置不接受Cookie，也可以设置不想服务器发送Cookie。
`window.navigator.cookieEnabled`属性返回一个布尔值，表示浏览器是否打开Cookie功能。
`document.cookie`属性返回当前网页的Cookie。

不同浏览器器对Cookie数量和大小的限制，是不一样的。一般来说，单个域名设置的Cookie不应超过30个，每个Cookie的大小不能超过4KB。超过限制以后，Cookie将被忽略，不会被设置。浏览器的同源政策规定，两个网址只要域名相同和端口相同，就可以共享Cookie。不要求协议相同，`http://example.com`设置的Cookie，可以被`https://example.com`读取。

> 作用

1.会话状态管理：记住密码，保存登录、购物车等需要记录的信息
2.个性化设置：保存用户的偏好，比如网页的字体大小、背景色等
3.浏览器行为追踪：记录和分析用户行为，记录用户浏览数据，进行商品推荐

> 缺陷

1.Cookie会被附加在每个HTTP请求中，所以无形中增加了流量
2.由于在HTTP请求中的Cookie是明文传递的，所以安全性有问题（除非用HTTPS）
3.Cookie的大小限制在4KB左右，对于复杂的存储需求来说是不够用的


### Session
Session代表服务器与浏览器的一次会话过程，这个过程是连续的，也可以时断时续。Session是一种服务端机制，Session对象用来存储特定用户会话所需的信息。

Session由服务端生成，保存在服务器的内存、缓存、硬盘或数据中。

> 创建Session

当用户访问一个服务器，如果服务器启用Session，服务器就要为该用户创建一个SESSION，在创建这个SESSION的时候，服务器首先检查这个用户发送来的请求里是否包含了一个SESSION ID，如果包含了一个SESSION ID则说明之前该用户已经登陆过并为此用户创建过SESSION，那服务器就按照这个SESSION ID把这个SESSION在服务器的内存中查找出来（如果找不到，就有可能为他新创建一个），如果客户端请求里面不包含SESSION ID，则为该客户端创建一个SESSION并生成一个与此SESSION相关的SESSION ID。这个`SESSION ID是唯一的、不重复的、不容易找到规律的字符串`

`URL重写`：把Session id直接附加在URL路径的后面作为URL路径的附加信息，表现形式为：http://…./xxx;jSession=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764
`作为查询字符串附加在URL后面`：http://…../xxx?jSession=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764
`表单隐藏字段`，服务器会自动修改表单，添加一个隐藏字段，以便在表单提交时能够把Session id传递回服务器。

> 作用：Session的根本作用是在服务端存储用户和服务器会话的一些信息

1.判断用户是否登录
2.购物车功能

### Cookie和Session的区别
1.存放位置：Cookie保存在客户端，Session保存在服务端
2.存取方式不同：Cookie只能保存ASCII字符串，假如需求存取Unicode字符或者二进制数据，需要先进行编码。而Session中能够存取任何类型的数据，包括而不限于String、Integer、list、Map等。
3.安全性：Cookie存储在浏览器中，对客户端是可见的，客户端的一些程序可能会复制或者修改Cookie中的内容。而Session存储在服务器上，对客户端是透明的，不存在敏感信息泄露的风险。
4.有效期：Cookie的有效期依赖于过期时间属性，Session依赖于名为JSESSIONID的cookie，而Cookie JSESSIONID的过期时间默许为-1，只需要关闭浏览器（一次会话结束），该Session就会失效。
5.对服务器造成的压力不同：Session是存储在服务器端的，每个用户都会产生一个Session，假如并发访问的用户非常多，会产生非常多的Session，耗费大量的内存，而Cookie存储在客户端，不占用服务器资源。
6.跨域支持上的不同：Cookie支持跨域名访问，例如将domain属性设置为'baidu.com'，则以"baidu.com"为后缀的一切域名均能够访问该Cookie。跨域名Cookie如今被普遍用于网络中，而Session则不会支持跨域名访问。Session仅在它所在的域名内有效。
7.存储大小不同：单个Cookie保存的数据不能超过4k，Session可存储数据远高于Cookie。

#### 服务端根据Cookie中的信息判断用户是否登录，那么如果浏览器中止了Cookie，如何保障整个机制的正常运转。

1. 每次请求中都携带一个SessionID的参数，也可以Post的方式提交，也可以在请求的地址后面拼接`xxx?SessionID=123456...`
2. Token机制。Token机制多用于App客户端和服务器交互的模式，也可以用于Web端做用户状态管理。
Token的意思是令牌，是服务端生成的一串字符串，作为客户端进行请求的一个标识。Token机制和Cookie和Session的使用机制比较相似。
当用户第一次登录后，服务器根据提交的用户信息生成一个Token，响应时将Token返回给客户端，以后客户端只需带上这个Token前来请求数据即可，无需再次登陆验证。

#### 如何考虑分布式Session问题？

后端往往需要多台服务器共同来支撑前端用户请求，那如果用户在A服务器登录了，第二次请求跑到服务B就会出现登陆失效问题。
分布式Session一般的解决方案：
- Nginx ip_hash策略，服务端使用Nginx代理，每个请求按访问IP的hash分配，这样来自同一IP固定访问一个后台服务器，避免了在服务器A创建Session，第二次分发到服务器B的现象。
- Session复制，任何一个服务器上的Session发生改变（增删改），该节点会把这个Session的所有内容序列化，然后广播给所有其他节点。
- 共享Session，服务端无状态话，将用户的Session等信息使用缓存中间件来统一管理，保障分发到每个服务器的响应结果一致。

### session有如用户信息档案表, 里面包含了用户的认证信息和登录状态等信息. 而 cookie 就是用户通行证，Session + Cookie。

## TOKEN
token 也称作令牌，由uid+time+sign[+固定参数]
token 的认证方式类似于临时的证书签名, 并且是一种服务端无状态的认证方式, 非常适合于 REST API 的场景. 所谓无状态就是服务端并不会保存身份认证相关的数据。

### 组成
- uid: 用户唯一身份标识
- time: 当前时间的时间戳
- sign: 签名, 使用 hash/encrypt 压缩成定长的十六进制字符串，以防止第三方恶意拼接
- 固定参数(可选): 将一些常用的固定参数加入到 token 中是为了避免重复查库

### token认证流程
token 的认证流程与cookie很相似
- 用户登录，成功后服务器返回Token给客户端。
- 客户端收到数据后保存在客户端
- 客户端再次访问服务器，将token放入headers中
- 服务器端采用filter过滤器校验。校验成功则返回请求数据，校验失败则返回错误码

### token可以抵抗csrf，cookie+session不行

### 总结

- session存储于服务器，可以理解为一个状态列表，拥有一个唯一识别符号sessionId，通常存放于cookie中。服务器收到cookie后解析出sessionId，再去session列表中查找，才能找到相应session。依赖cookie
- cookie类似一个令牌，装有sessionId，存储在客户端，浏览器通常会自动添加。
- token也类似一个令牌，无状态，用户信息都被加密到token中，服务器收到token后解密就可知道是哪个用户。需要开发者手动添加。
- jwt只是一个跨域认证的方案

### CSRF
CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

#### CSRF的特点
攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。
整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”。
跨站请求可以用各种方式：图片URL、超链接、CORS、Form提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。

#### 防护策略
- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
- 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重Cookie验证

#### CSRF Token
CSRF的另一个特征是，攻击者无法直接窃取到用户的信息（Cookie，Header，网站内容等），仅仅是冒用Cookie中的信息。

而CSRF攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个CSRF攻击者无法获取到的Token。服务器通过校验请求是否携带正确的Token，来把正常的请求和攻击的请求区分开，也可以防范CSRF的攻击。

### XSS
XSS 攻击指的是跨站脚本攻击，是一种代码注入攻击。攻击者通过在网站注入恶意脚本，使之在用户的浏览器上运行，从而盗取用户的信息如 cookie 等。

XSS 的本质是因为网站没有对恶意代码进行过滤，与正常的代码混合在一起了，浏览器没有办法分辨哪些脚本是可信的，从而导致了恶意代码的执行。

XSS 一般分为存储型、反射型和 DOM 型。

- 存储型指的是恶意代码提交到了网站的数据库中，当用户请求数据的时候，服务器将其拼接为 HTML 后返回给了用户，从而导致了恶意代码的执行。
- 反射型指的是攻击者构建了特殊的 URL，当服务器接收到请求后，从 URL 中获取数据，拼接到 HTML 后返回，从而导致了恶意代码的执行。
- DOM 型指的是攻击者构建了特殊的 URL，用户打开网站后，js 脚本从 URL 中获取数据，从而导致了恶意代码的执行

DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

XSS 攻击的预防可以从两个方面入手，`一个是恶意代码提交的时候，一个是浏览器执行恶意代码的时候。`
对于第一个方面，如果我们对存入数据库的数据都进行的转义处理，但是一个数据可能在多个地方使用，有的地方可能不需要转义，由于我们没有办法判断数据最后的使用场景，所以直接在输入端进行恶意代码的处理，其实是不太可靠的。

因此我们可以从浏览器的执行来进行预防，一种是使用纯前端的方式，不用服务器端拼接后返回。另一种是对需要插入到 HTML 中的代码做好充分的转义。对于 DOM 型的攻击，主要是前端脚本的不可靠而造成的，我们对于数据获取渲染和字符串拼接的时候应该对可能出现的恶意代码情况进行判断。

预防存储型和反射型 XSS 攻击:
- 纯前端渲染，把代码和数据分隔开。
- 对 HTML 做充分转义。

纯前端渲染的过程：
- 浏览器先加载一个静态 HTML，此 HTML 中不包含任何跟业务相关的数据。
- 然后浏览器执行 HTML 中的 JavaScript。
- JavaScript 通过 Ajax 加载业务数据，调用 DOM API 更新到页面上。

预防 DOM 型 XSS 攻击：
DOM 型 XSS 攻击，实际上就是网站前端 JavaScript 代码本身不够严谨，把不可信的数据当作代码执行了。

在使用 .innerHTML、.outerHTML、document.write() 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 .textContent、.setAttribute() 等。

如果用 Vue/React 技术栈，并且不使用 v-html/dangerouslySetInnerHTML 功能，就在前端 render 阶段避免 innerHTML、outerHTML 的 XSS 隐患。

> 其他安全措施
HTTP-only Cookie: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。
验证码：防止脚本冒充用户提交危险操作。