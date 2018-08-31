## process.cwd()
获取node命令启动路径，其值与代码所在位置无关，即`运行node命令时所在的文件夹的绝对路径`。

File System模块使用相对路径读写文件时，参考的就是这个路径。适用于开发命令行程序时，读取命令启动位置目录的文件。

## __dirname
被执行的js所在的文件夹的绝对路径

## __filename
被执行的js的绝对路径

## require()
只有在require时才使用相对路径(./，../)的引用方法。require的使用效果是跟__dirname的效果相同，不会因为启动脚本的目录不一样而改变。

## 实例
```
G://
angular/
    - server/
        - main.js
        - api.js
    - spider/
        - mono.js
        - one.js     

运行代码：
var path = require('path');
console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(path.resolve('./'));
```
以下结果都是运行main.js所得：

- 在server文件夹下，输出结果是：
```
G:\angular\server
G:\angular\server\main.js
G:\angular\server
G:\angular\server
```
- 在angular文件下，输出结果是：
```
G:\angular\server
G:\angular\server\main.js
G:\angular
G:\angular
```

- 获取相同目录下的其他文件
    - path.join(path.dirname(__filename) + '/api.js')
    - path.resolve(__dirname + '/api.js')

此时，不管是在angular文件夹下，还是server文件夹下，两者的结果都是`G:\angular\server\api.js`。

- 获取相邻目录下的文件
    - 在windows下`path.resolve(__dirname , '../spider/mono.js`，两种文件夹下运行结果一致；
    - `在Linux的centos7下，两者结果不一致。angular文件夹下会报错`。
        - 如果在angular文件夹下，使用`path.resolve(path.resolve('./') + '/spider/mono.js')`，或者`path.resolve(process.cwd() + '/spider/mono.js')`；
        - 如果在server文件夹下，使用`path.resolve(__dirname , '../spider/mono.js')`; 

## path.resolve和path.join的区别
- path.join 全部给定的 path 片段连接到一起，并规范化生成的路径。如果`连接后的路径字符串`是一个长度为零的字符串，则代表返回 '.'，表示当前工作目录。不会对'/'进行解读
- path.resolve 把一个路径或路径片段的序列解析为一个绝对路径，会将'/'当成根目录。

两者都是正常解读'..''.'
假设在G://angular；
path.join('a', 'b', 'c')    //  'a/b/c'
path.join('a', 'b', '..', 'c')      //  'a/c'
path.resolve('a', 'b', '..', 'c')       //  G://a/c
path.resolve('/a', '/b', '..', 'c')       //  G://c


