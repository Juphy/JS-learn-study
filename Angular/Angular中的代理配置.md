Angular 中的代理配置时`ng serve`提供的代理服务。
在开发环境中，Angular 应用与后端服务联调测试时，Chrome 浏览器会对发送的请求进行跨域检测，通过代理服务器，来解决开发模式下的跨域问题。

> 通过代理服务实现请求`http://localhost:4200/api`时代理到后端服务`http://localhost:8080/api`

### 基本代理

在项目下创建一个名为`proxy.config.json`的代理配置文件，

```
{
    "/api":{
        "target": "http://localhost:8000",
        "secure": false
    }
}
```

1.通过`--proxy-config`参数来加载代理配置文件

```
ng serve --proxy-config=proxy.config.json
```

2.在`angular.json`中通过 proxyConfig 属性来设置代理

```
"architect": {
    "serve":{
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "proxy.conf.json"
    }
}
```

### 路劲重写

在基本代理中，配置了`http://localhost:4200/api`代理后端服务`http://localhost:8080/api`。而在实际开发中，后端服务可能没有提供`/api`前缀，实际的后端服务可能是这样的：

```
http://localhost:8080/users
http://localhost:8080/orders
```

在这种情况下，上面配置的基本代理就无法满足我们的需求了，因为后端不存在`http://localhost:8080/api/users`服务，`Angular CLI`代理提供了路径重写功能

```
{
    "/api":{
        "target": "http://localhost:8080",
        "secure": false,
        "pathRewrite":{
            "^/api":""
        }
    }
}
```

此时访问`http://localhost:4200/api/users`，代理服务会给我们代理到后端服务`http://localhost:8080/users`上。路劲重写功能可以很好的区分前端路由和后端服务，可以一目了然的知道`http://localhost:4200/api/users`访问的是一个后端服务。

### 非本地域

前后端的交互就是 REST 接口，在这样的实际环境中，前端工程师的本地不会运行后端服务，而是使用后端工程师提供的服务，此时后端服务就不会是`localhost`，而可能是`http://test.admin.com/user`。

此时需要用代理的另一个参数`changeOrigin`来满足我们的需求，

```
{
    "/api":{
        "target":"http://test.domain.com",
        "secure": false,
        "pathRewrite":{
            "^/api":""
        },
        "changeOrigin": true
    }
}
```

这样，访问`http://localhost:4200/api/user`就会被代理到`http://test.admin.com/users`。

### 代理日志

在使用前端代理的过程中，如果想要调试代理是否正常工作，还可以添加`logLevel`选项：

```
{
    "/api":{
        "target": "http://test.domain.com",
        "secure": false,
        "pathRewrite":{
            "^/api":""
        },
        "logLevel": "debug"
    }
}
```

`logLevel`支持的级别选项有 `debug`，`info`，`warn`，`silent`，默认是`info`级别。

### 多代理入口

如果前端需要配置多个入口代理到同一个后端服务，不想使用前面的路劲重写方式，我们可以创建一个`proxy.conf.js`文件来替代我们上面的`proxy.xonf.json`

```
const PROXY_CONFIG=[
    {
        context:[
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target:"http://localhost:3000",
        secure: false
    }
]
module.exports = PROXY_CONFIG;
```
修改我们的`angular.json`中的`proxyConfig`为`proxy.conf.js`:
```
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "proxy.conf.js"
    },
...
```
