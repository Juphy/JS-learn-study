let request = require('request'),
    path = require('path'),
    fs = require('fs');

// 搜索API
// http://search.kuwo.cn/r.s?client=kt&all={$word}&pn={$page}&rn={$size}&uid=221260053&ver=kwplayer_ar_99.99.99.99&vipver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1
// word 关键词  page 起始页  size 每一页返回的数量


const PAGE = 0;
const SIZE = 10;
let filename = 'data.json';
fs.readFile(path.join(__dirname, filename), (err, data) => {
    data = JSON.parse(data.toString());
    let songs = data['songs'], singers = data['singers'];
    songs.forEach(item => {
        request(encodeURI(`http://search.kuwo.cn/r.s?client=kt&all=${item}&pn=${PAGE}&rn=${SIZE}&uid=221260053&ver=kwplayer_ar_99.99.99.99&vipver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1`), (error, response, body) => {
            console.log(body);
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                const songs = body['songs'];
            }
        })
    });
});
