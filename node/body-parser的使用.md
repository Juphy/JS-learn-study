在HTTP请求中，POST、PUT和PATCH三种请求方法中包含请求体，Node.js 原生HTTP模块中，请求体要基于流的方式接收和解析。body-parser是一个HTTP请求体解析中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体，Express框架中就是使用这个模块做为请求体解析中间件。

常见的四种Content-Type类型：
- application/x-www-form-urlencoded 常见的form提交
- multipart/form-data 文件提交
- application/json  提交json格式的数据
- text/xml  提交xml格式的数据

## 原生环境解析
Node.js 原生HTTP模块中，是将用户请求数据封装到了用于请求对象req中，该对象是一个IncomingMessage，该对象同时也是一个可读流对象。在原生HTTP服务器，或不依赖第三方解析模块时，可以像下面这样接收并解析请求体。
```
const http = require('http');

//用http模块创建一个http服务端
http.createServer(function(req, res) {
  if (req.method.toLowerCase() === 'post') {
    var body = '';
    req.on('data', function(chunk){
      body += chunk;
    });

    req.on('end', function(){
      if(req.headers['content-type'].indexOf('application/json')!==-1){
        // JSON 格式请求体解析
        JSON.parse(body);
      } else if(req.headers['content-type'].indexOf('application/octet-stream')!==-1){
        // Raw 格式请求体解析
        // ……
      } else if(req.headers['content-type'].indexOf('text/plain')!==-1){
        // text 文本格式请求体解析
        // ……
      } else if(req.headers['content-type'].indexOf('application/x-www-form-urlencoded')!==-1){
        // URL-encoded 格式请求体解析
        // ……
      } else {
      	// 其它格式解析
      }
    })
  } else {
    res.end('其它提交方式');
  }
}).listen(3000);
```
## body-parse解析
### express顶层处理
```
/* 引入依赖项 */
var express = require('express');
// ……
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ……

// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
```
### 解析具体路由
不同路径（路由）可能会要求用户使用不同的内容类型，body-parser还支持为单个Express路由添加请求体解析：
```
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// 创建 application/json 解析
var jsonParser = bodyParser.json()

// 创建 application/x-www-form-urlencoded 解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login 获取 URL编码的请求体
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users 获取 JSON 编码的请求体
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body
})
```
### 指定请求类型
body-parser还支持为某一种或一类内容类型的请求体指定解析方式，指定时可以通过在解析方法中添加type参数修改指定Content-Type的解析方式。
- `text/plain`  app.use(bodyParser.json({ type: 'text/plain' }))，也可以使用app.use(bodyParser.text())进行解析
更多非标准请求头的解析：
```
// 解析自定义的 JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// 解析自定义的 Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// 将 HTML 请求体做为字符串处理
app.use(bodyParser.text({ type: 'text/html' }))
```
## body-parser模块api
### bodyParser.json()
解析JSON格式，返回一个仅解析json格式数据的中间件。这个方法支持任意Unicode编码的请求体，且支持gzip和deflate编码的数据压缩。

bodyParser.json(options)，options可选值：
- inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
- limit - 设置请求的最大数据量。默认为'100kb'
- reviver - 传递给JSON.parse()方法的第二个参数，详见JSON.parse()
- strict - 设置为true时，仅会解析Array和Object两种格式；设置为false会解析所有JSON.parse支持的格式。默认为true
- type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串时，会使用type-is来查找mime类型，并同时可以为扩展名如json或者mime类型（application/json），或者一个包含通配符的mime类型（`*/*`，*/json）；当为函数时，中间件会通过fn(req)来获取实际值。默认为application/json。
- verify - 这个选项仅在verify(req, res, buf, encoding)时受支持，buf表示一个Buffer对象，其中包含的是初始的消息体，也就是没有解析过的消息体，encoding表示这个请求的编码类型，如果抛出异常那么停止解析。

### bodyParser.raw()
解析二进制格式，返回一个将所有数据做为Buffer格式处理的中间件。这个方法支持gzip和deflate编码的数据压缩。解析后，其后的所有的req.body中将会是一个Buffer数据。

bodyParser.raw(options)，options可选值：
- inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
- limit - 设置请求的最大数据量。默认为'100kb'
- type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找mime类型，这个string扩展名可以是bin，或者mime是application/octet-stream，也可以是通配符（`*/*`，application/*）；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/octet-stream。
- verify - 这个选项仅在verify(req, res, buf, encoding)时受支持，buf表示一个Buffer对象，其中包含的是初始的消息体，也就是没有解析过的消息体，encoding表示这个请求的编码类型，如果抛出异常那么停止解析。

### bodyParser.text()
解析文本格式，返回一个仅处理字符串格式处理的中间件。这个方法支持gzip和deflate编码的数据压缩。解析后，其后的所有的req.body中将会是一个字符串值。

bodyParser.text(options)，options可选值：
- defaultCharset - 如果Content-Type后没有指定编码时，使用此编码。默认为'utf-8'
- inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
- limit - 设置请求的最大数据量。默认为'100kb'
- type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找mime类型，这个string可以是扩展名为txt,或者mime类型为text/plain；当为函数是，中间件会通过fn(req)来获取实际值。默认为text/plain。
- verify - 这个选项仅在verify(req, res, buf, encoding)时受支持，buf表示一个Buffer对象，其中包含的是初始的消息体，也就是没有解析过的消息体，encoding表示这个请求的编码类型，如果抛出异常那么停止解析。

### bodyParser.urlencoded()
解析form表单数据“application/x-www-form-urlencoded”，返回一个处理urlencoded数据的中间件。这个方法默认使用UTF-8编码，且支持gzip和deflate编码的数据压缩。解析后，其后的所有的req.body中将会是一个键值对对象。

bodyParser.urlencoded(options)，options可选值：
- extended - 当设置为false时，会使用querystring库解析URL编码的数据；当设置为true时，会使用qs库解析URL编码的数据。后没有指定编码时，使用此编码。默认为true
- inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
- limit - 设置请求的最大数据量。默认为'100kb'
- parameterLimit - 用于设置URL编码值的最大数据。默认为1000，如果参数多余这个数量那么返回给客户端a413
- type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找mime类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为为application/x-www-form-urlencoded。
- verify - 这个选项仅在verify(req, res, buf, encoding)时受支持，buf表示一个Buffer对象，其中包含的是初始的消息体，也就是没有解析过的消息体，encoding表示这个请求的编码类型，如果抛出异常那么停止解析。

## 详解urlencoded

 bodyParser.urlencoded  模块用于解析req.body的数据，解析成功后覆盖原来的req.body，如果解析失败则为 {}。该模块有一个属性extended，extended选项允许配置使用querystring(false)或qs(true)来解析数据，默认值是true，但这已经是不被赞成的了。

querystring就是nodejs内建的对象之一，用来字符串化对象或解析字符串。qs是一个querystring的库，在qs的功能基础上，还支持更多的功能并优化了一些安全性。querystring并不能正确的解析复杂对象（多级嵌套），而qs却可以做到。
```
querystring.parse("name=henry&age=30") => { name: 'henry', age: '30' }

querystring.parse("info[name]=henry&info[age]=30&hobby[1]=sport&hobby[2]=coding") =>
  {
    'info[name]': 'henry',
    'info[age]': '30',
    'hobby[1]': 'sport',
    'hobby[2]': 'coding'
  }

qs.parse("info[name]=henry&info[age]=30&hobby[1]=sport&hobby[2]=coding") =>
  {
    info: {
      name: 'henry',
      age: '30'
    },
    hobby: [ 'sport', 'coding' ]
  }

```
但是qs也不是万能的，对于多级嵌套的对象，qs只会解析5层嵌套，超出的部分会表现的跟本文头部的那种情况一样；对于数组，qs最大只会解析20个索引，超出的部分将会以键值对的形式解析。
作为一个中间件，qs必须要为性能考虑，才会有如此多的限制，express也默认使用qs来解析请求体。
理论上来说，form表单提交不会有多级嵌套的情况，而urlencoded本身也是form的内容类型，因此，bodyParser.urlencoded不支持多级嵌套也是很合理的设计。如果非要上传一个十分复杂的对象，可以将Content-type修改为“application/json”。


