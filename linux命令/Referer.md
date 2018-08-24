### 什么是Referer?
> Referer[sic] 请求头字段允许由客户端指定资源的 URI 来自于哪一个请求地址，这对服务器有好处（应该是 “referrer” 这个字段拼错了）。Referer 请求头让服务器能够拿到请求资源的来源，可以用于分析用户的兴趣爱好、收集日志、优化缓存等等。同时也让服务器能够发现过时的和错误的链接并及时维护。

Referer是HTTP请求header的一部分，当浏览器向web服务器发送请求的时候，头信息里包含有Referer。Request Headers中有一个Referer字段，对应的信息表示一个来源。

### Referer的作用？
- 防盗链

如果我在`www.a.com`里有一个`www.b.com`链接，那么访问`www.b.com`时，它的Request Headers中有Referer: `www.a.com`，可以利用这个来防止盗链了，比如我只允许我自己的网站访问我自己的图片服务器，那我的域名是`www.a.com`，那么图片服务器每次取到Referer来判断一下是不是我自己的域名`www.a.com`，如果是就继续访问，不是就拦截。

- 获取访问来源，统计访问流量的来源和搜索的关键词

像CNZZ、百度统计等可以通过Referer统计访问流量的来源和搜索的关键词（包含在URL中）等等，方便站长们有针性对的进行推广和SEO。

### 防盗链
> nginx配置防盗链

利用valid_referers指令防盗链，HTTPReferer头信息是可以通过程序来伪装生成的，所以通过Referer信息防盗链并非100%可靠，但是，它能够限制大部分的盗链。

`valid_referers  [none|blocked|server_names]`
默认值：none 使用环境：server，location 该指令会根据Referer Header头的内容分配一个值为0或1给变量$invalid_referer。

该指令的参数的值：
- none：表示无Referer值
- blocked：表示Referer值被防火墙进行伪装
- server_names：表示一个或者多个主机名称

```
location ~*\.(gif|jpg|png)$ {
    root /home/www/spider/;
    valid_referers *.juphy.cn;
    if ($invalid_referer) {
        rewrite ^/soso.com // 当没有referer进行访问时，会自动跳转到这个链接。
        return 403;
    }
}
```

关于nginx.conf的配置，if判断注意保持空格。

### 反盗链
- 通过nodejs设置referer
```
let http = require('http');
let option = {
    hostname: 'img.juphy.cn',
    path: '/mono/images/2018-8-22.jpg'
};

http.get(option, res => {
    let imgdata = '';
    res.on('data', chunk => {
        imgdata += chunk;
    });
    res.on('end', () => {
        console.log(imgdata);
    })
});
```



