## eventproxy 控制并发

如果并发异步获取两三个地址的数据，并且要在获取到数据之后，对这些数据一起进行利用的话，常规的写法是自己维护一个计数器。\
先定义一个 var count = 0，然后每次抓取成功以后，就 count++。如果你是要抓取三个源的数据，由于你根本不知道这些异步操作到底谁先完成，那么每次当抓取成功的时候，就判断一下 count === 3。当值为真时，使用另一个函数继续完成操作。\
而 eventproxy 就起到了这个计数器的作用，它来帮你管理到底这些异步操作是否完成，完成之后，它会自动调用你提供的处理函数，并将抓取到的数据当参数传过来。

### 无限嵌套

```
$.get("http://data1_source", function (data1) {
  // something
  $.get("http://data2_source", function (data2) {
    // something
    $.get("http://data3_source", function (data3) {
      // something
      var html = fuck(data1, data2, data3);
      render(html);
    });
  });
});
```

### 计数器

```
(function(){
    var count = 0;
    var result = {};
    $.get('http://data1_source', data => {
        count++;
        handle();
    });
    $.get('http://data2_source', data => {
        count++;
        handle();
    });
    $.get('http://data3_source', data => {
        count++;
        handle();
    });
    function handle(){
        if(count === 3){
        ......
    }
})
```

### eventproxy

```
var ep = new eventproxy();

// ep.all 监听三个事件，每当一个源的数据抓取完成时，就通过ep.emit()来告诉ep，某某事件完成了。当三个事件未同时完成时，ep.emit()调用之后不会做任何事，当三个事件都完成时，就会调用末尾的那个回调函数。
ep.all('data1_event', 'data2_event', 'data3_event', function (data1, data2, data3) {
  var html = fuck(data1, data2, data3);
  render(html);
});

$.get('http://data1_source', function (data) {
  ep.emit('data1_event', data);
  });

$.get('http://data2_source', function (data) {
  ep.emit('data2_event', data);
  });

$.get('http://data3_source', function (data) {
  ep.emit('data3_event', data);
  });
```

如果已经确定请求的次数，可以使用 eventproxy 的`after`API。

```
let eventproxy = require('eventproxy');
var ep = new eventproxy();


// 命令 ep 重复监听 datas.length 次（在这里也就是 40 次） `data_event` 事件再行动
ep.after('data_event', datas.length, function (data) {
  // data 是个数组，包含了 40 次 ep.emit('data_event', pair) 中的那 40 个 pair
}
datas.forEach(item => {
  superagent.get(item.url)
    .end(function (err, res) {
      ep.emit('data_event', res);
    });
});
```

## async 控制并发

爬虫时如果太多的并发链接，就会被看做是恶意请求，因此要控制一下并发的数量，如果有 1000 个链接，并发 10 个。\

### mapLimit

```
let async = require('async');
let count = 0; // 并发的计数器
let fetchUrl = (url, callback) => {
    let delay = parseInt((Math.random() * 10000000) % 2000, 10);
    count++;
    console.log('现在并发数是', count, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
    setTimeout(() => {
        count--;
        callback(null, url + ' html content');
    }, delay);
};

var urls = [];
for (var i = 0; i < 30; i++) {
    urls.push('http://datasource_' + i);
}

async.mapLimit(urls, 5, (url, callback) => {
    fetchUrl(url, callback);
}, (err, result) => {
   console.log('final:');
   console.log(result);
});
```

### [queue](https://github.com/caolan/async#queueworker-concurrency)

### Bagpipe

```
npm install bagpipe

for(var i = 0; i< 100; i++){
  async(function(){
    // 异步调用
  })
}

// Bagpipe
var Bagpipe = require('bagpipe');
// 设定并发数10
var bagpipe = new Bagpipe(10);
for(var i =0;i<100;i++){
  bagpipe.push(async, function(){
    // 异步回调执行
  })
}
```

- refuse，当队列填满时，拒绝新到来的异步调用。执行异步调用的回调函数，传递一个 TooMuchAsyncCallError 异常。默认为 false。
- timeout，设置全局异步调用超时时间，经过 push 后执行的异步调用，如果在超时时间内没有返回执行，将会执行异步调用的回调函数，传递一个 BagpipeTimeoutError 异常。默认为 null 不开启。

Bagpipe 通过 push 将调用传入内部队列，如果活跃调用小于最大并发数，将会被取出直接执行，反之则继续呆在队列中。当一个异步调用结束的时候，会从队列前取出调用执行，以此来保证异步调用的活跃量不高于限定值。
当队列的长度大于 1 时，Bagpipe 对象将会触发它的 full 事件，该事件传递队列长度值。该值有助于评估业务性能参数。示例如下：

```
bagpipe.on('full', function (length) {
console.warn('底层系统处理不能及时完成，排队中，目前队列长度为:' + length);
});
```

如果队列的长度也超过限制值，这里可以通过 refuse 选项控制，是直接传递异常拒绝服务还是继续排队。默认情况 refuse 为 false。如果设置为 true，新的异步调用将会得到 TooMuchAsyncCallError 异常，而被拒绝服务。

```
var bagpipe = new BagPipe(10, {
refuse: true
});
```

如果异步调用的超时不可预期，可能存在等待队列不均衡的情况，为此可以全局设置一个超时时间，对于过长的响应时间，提前返回超时状态。

```
var bagpipe = new BagPipe(10, {
timeout: 1000
});
```
- 确保异步调用的最后一个参数为回调参数
- 监听full事件，以增加你对业务性能的评估
- 目前异步方法未支持上下文。确保异步方法内部没有this引用。如果存在this引用，请用bind方法传递正确的this上下文
- 异步调用应当具备timeout的业务处理，无论业务是否完成，总在一定的时间内保证返回

### 实践操作
当你需要遍历文件目录的时候，异步可以确保充分利用IO。你可以轻松发起成千上万个文件的读取。但是，系统文件描述符是有限的。
```
Error: EMFILE, too many open files
```
同步方法来进行处理。但是，同步时，CPU与IO并不能并行利用，一定情况下，性能是不可弃的一项指标。用上Bagpipe，可以轻松享受并发，也能限制并发。
```
var bagpipe = new Bagpipe(10);

var files = ['这里有很多很多文件'];
for (var i = 0; i < files.length; i++) {m

  // fs.readFile(files[i], 'utf-8', function (err, data) {
  bagpipe.push(fs.readFile, files[i], 'utf-8', function (err, data) {
    // 不会因为文件描述符过多出错
    // 妥妥的
  });
}
```