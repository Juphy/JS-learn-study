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

如果已经确定请求的次数，可以使用eventproxy的`after`API。
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
爬虫时如果太多的并发链接，就会被看做是恶意请求，因此要控制一下并发的数量，如果有1000个链接，并发10个。\

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
