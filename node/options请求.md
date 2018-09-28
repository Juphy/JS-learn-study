## 什么是options请求？
OPTIONS请求方法的主要用途：
- 获取服务器支持的HTTP请求方法
- 用来检查服务器的性能。列如：AJAX进行跨域请求时的预检，需要向另外一个域名的资源发送一个HTTP OPTIONS请求头，用以判断实际发送的请求是否安全。

## 为什么会用到options请求？
浏览器将cors请求分为两类：简单请求和非简单请求。满足以下两大条件，就属于简单请求。
1. 请求方法是以下三种方法之一：
- HEAD
- GET
- POST
2.HTTP的头信息不超出以下几种字段：
- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type： 只限于application/x-www-form-urlencoded、multipart/form-data、text/plain

### 简单请求
对于简单请求，浏览器直接发出CORS请求，具体来说，就是在头信息之中，增加一个Origin字段。

