## Referer
### 什么是Referer?
> Referer[sic] 请求头字段允许由客户端指定资源的 URI 来自于哪一个请求地址，这对服务器有好处（应该是 “referrer” 这个字段拼错了）。Referer 请求头让服务器能够拿到请求资源的来源，可以用于分析用户的兴趣爱好、收集日志、优化缓存等等。同时也让服务器能够发现过时的和错误的链接并及时维护。

Referer是HTTP请求header的一部分，当浏览器向web服务器发送请求的时候，头信息里包含有Referer。Request Headers中有一个Referer字段，对应的信息表示一个来源。

###

### Referer的作用？
- 防盗链

如果我在`www.a.com`里有一个`www.b.com`链接，那么访问`www.b.com`时，它的Request Headers中有Referer: `www.a.com`，可以利用这个来防止盗链了，比如我只允许我自己的网站访问我自己的图片服务器，那我的域名是`www.a.com`，那么图片服务器每次取到Referer来判断一下是不是我自己的域名`www.a.com`，如果是就继续访问，不是就拦截。

- 防止恶意请求

### 空的Referer
- 直接通过浏览器访问，Referer的只就是空。