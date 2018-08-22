## express的使用
### express应用程序生成器


### express中提供静态文件
为了提供诸如图像，css文件和JavaScript文件之类的静态文件，请使用express中的express.static内置中间件。

将包含静态资源的目录的名称传递给express.static中间件函数，以便开始直接提供这些文件。例如，使用在public的目录中提供图像，css文件和javascript文件：
```
app.use(express.static('public'));
```
现在，可以访问位于public目录的文件：
```
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```
> Express相对于静态目录查找文件，因此静态目录的名称不是此URL的一部分。

要使用多个静态文件，请多次调用express.static中间件函数:
```
app.use(express.static('public'));
app.use(express.static('files'));
```
Express以使用express.static中间件函数设置静态目录的顺序来查找文件。\
要为 express.static 函数提供的文件创建虚拟路径前缀（路径并不实际存在于文件系统中），请为静态目录指定安装路径，如下所示：
```
app.use('/static', express.static('public')); 
//获取放置在public文件夹下的静态文件,
```
现在，可以访问具有/static路径前缀的public目录中的文件。
```
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```
然而，向 express.static 函数提供的路径相对于您在其中启动 node 进程的目录。如果从另一个目录运行 Express 应用程序，那么对于提供资源的目录使用绝对路径会更安全：
```
app.use('/static', express.static(path.join(__dirname + '/public')));
```
