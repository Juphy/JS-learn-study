let async = require('async');
const fn1 = () => {
    let count = 0;
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
}

async.waterfall([
    function (callback) {
        callback(null, 'one', 'two');
    },
    function (arg1, arg2, callback) {
        callback(null, 'three');
    },
    function (arg1, callback) {
        callback(null, 'done');
    }
], function (err, result) {
    console.log(result);
});

