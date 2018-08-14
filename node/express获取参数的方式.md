## nodejs接收get请求参数

在http协议中，一个完整的url路径如下：

![完整的url路径](http://ww1.sinaimg.cn/large/8b2b1aafly1fu91lq2nqaj20se0ebq3a.jpg)

get请求的参数是直接在url路径中显示的，在path资源路径的后面添加，以？表示参数的开始，以key = value表示参数的键值对，多个参数以&符号分割，hash表示的是资源定位符，由浏览器自己解析处理。

浏览器向服务端发送get请求主要有两种方式，一种是href跳转，url拼接参数；一种是ajax请求发送参数。

```
let url = require('url');
let app = http.createServer();
app.on('request', function (req, res) {

    //1.默认情况下，如果url路径中有中文，则会对中文进行URI编码，所以服务端要想获取中文需要对url进行URI解码
    console.log(encodeURI(req.url));
    // 2.url.parse 方法可以将一个 URL 路径解析为一个方便操作的对象
    // 将第二个可选参数指定为 true， 表示将结果中的 query 解析为一个对象
    var parseObj = url.parse(req.url, true);
    console.log(parseObj);
    var pathname = parseObj.pathname; //相当于无参数的url路径
    console.log(pathname);
    // 这里将解析拿到的查询字符串对象作为一个属性挂载给 req 对象，这样的话在后续的代码中就可以直接通过 req.query 来获取查询字符串了
    req.query = parseObj.query;
    console.log(req.query);
    if (pathname === '/heroAdd') {
        fs.readFile('./heroAdd.html', function (err, data) {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    } else if (pathname.indexOf('/node_modules') === 0) {
        fs.readFile(__dirname + pathname, function (err, data) {
            if (err) {
                throw err;
            } else {
                console.log(data);
                res.end(data);
            }
        });
    } else {
        res.end('请求路径： ' + req.url);
    }
});

app.listen(3000, function () {
});
```

## nodejs接收post请求参数

post请求参数不直接在url路径中拼接，而是放在请求体中发送给服务器，请求三要素：请求行、请求头、请求体。

与get请求不同的是，服务端接收post请求参数不是一次就可以获取的，通常需要多次。

### 服务端接收表单数据

- (1)如果表单数据量越多，则发送的次数越多，如果比较少，可能一次就发过来了
- (2)接收表单数据的时候，需要通过监听 req 对象的 data 事件来取数据
- (3)每当收到一段表单提交过来的数据，req 的 data 事件就会被触发一次，同时通过回调函数可以拿到该 段 的数据 
服务端需要自己添加数据流
- (4)当接收表单提交的数据完毕之后，会执行req的 on 事件

### 服务端处理表单数据

- (1) 对数据进行解码（中文数据提交会进行url编码）decodeURI(data)
- (2) 使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象。
- (3) 将数据插入到数据库

```
//1.导入http模块
var http = require('http');
//导入文件模块
var fs = require('fs');
//导入路径模块
var path = require('path');
//导入querystring模块（解析post请求数据）
var querystring = require('querystring');

//2.创建服务器
var app = http.createServer();

//3.添加响应事件
app.on('request', function (req, res) {

    console.log(req.method);

    //1.通过判断url路径和请求方式来判断是否是表单提交
    if (req.url === '/heroAdd' && req.method === 'POST') {
        /**服务端接收post请求参数的流程
         * （1）给req请求注册接收数据data事件（该方法会执行多次，需要我们手动累加二进制数据）
         *      * 如果表单数据量越多，则发送的次数越多，如果比较少，可能一次就发过来了
         *      * 所以接收表单数据的时候，需要通过监听 req 对象的 data 事件来取数据
         *      * 也就是说，每当收到一段表单提交过来的数据，req 的 data 事件就会被触发一次，同时通过回调函数可以拿到该 段 的数据
         * （2）给req请求注册完成接收数据end事件（所有数据接收完成会执行一次该方法）
         */
        //创建空字符叠加数据片段
        var data = '';

        //2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
        req.on('data', function (chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            data += chunk;
        });

        // 3.当接收表单提交的数据完毕之后，就可以进一步处理了
        //注册end事件，所有数据接收完成会执行一次该方法
        req.on('end', function () {

            //（1）.对url进行解码（url会对中文进行编码）
            data = decodeURI(data);
            console.log(data);

            /**post请求参数不能使用url模块解析，因为他不是一个url，而是一个请求体对象 */

            //（2）.使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象
            //querystring是nodejs内置的一个专用于处理url的模块，API只有四个，详情见nodejs官方文档
            var dataObject = querystring.parse(data);
            console.log(dataObject);
        });
    }

    if (req.url === '/heroAdd' && req.method === 'POST') {
        fs.readFile('./heroAdd.html', function (err, data) {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    } else if (req.url.indexOf('/node_modules') === 0) {
        fs.readFile(__dirname + req.url, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.end(data);
            }
        });
    } else {
        res.end('请求路径： ' + req.url);
    }
});

//4.监听端口号
app.listen(3000, function () {
});
```

## nodejs使用express框架获取参数的方式

### req.params

命名过的参数会以键值对的形式存放，路由`/user/:name`，浏览器访问`/user/a`，a值即name的属性会存放在req.params.name；如果有多个参数`/find/:group/:name`，浏览器访问`find/a/b`，`a=req.params.group`和`b=req.params.name`分别获取group和name的两个参数。

### req.query

`/user/?id=1`，req.query.id会得到1，如果有两个或者两个以上的参数用&连接，`/user/?id=1&name=test`，req.query.id --> 1，req.query.name --> test。

### req.body

通过post方式提交的参数`$.post('/add', {sid: 'sid'})`
```
let bodyParser = require('body-parser')
let multer = require('multer');
let upload = require('multer'); // for parsing multipart/form-data
app.use(bodyParser.urlencode({extended: true})) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()) //  for parsing application/json
app.post('/add', function(req, res){
    let sid = req.body.sid;
})

app.post('/profile', upload.array(), function (req, res, next) {
  console.log(req.body);
  res.json(req.body);
});
```

### req.param

req.param()是req.query、req.body、以及req.params获取参数的三种方式的封装，req.params(name)返回name参数的值。
```
// POST name=tobi
app.post('/user?name=tobi',function(req,res){
 req.param('name');
 // => "tobi"
})

// ?name=tobi
req.param('name')
// => "tobi"

// /user/tobi for /user/:name 
req.param('name')
// => "tobi"
```

