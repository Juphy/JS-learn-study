let request = require('request'),
    path = require('path'),
    sprintf = require('printj').sprintf,
    fs = require('fs');
const url = 'https://api.imjad.cn/cloudmusic/';

let filename = 'data.json';
fs.readFile(path.join(__dirname, filename), (err, data) => {
    data = JSON.parse(data.toString());
    let songs = data['songs'], singers = data['singers'];
    songs.forEach(item => {
        request(url + '?type=search&search_type=1&s=' + item, (error, response, body) => {
            console.log(body);
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                const songs = body['songs'];
            }
        })
    });
    singers.forEach(item => {
        request(url + '?type=search&search_type=1002&s=' + encodeURI(item), (error, response, body) => {
            console.log(body);
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                const songs = body['songs'];
            }
        })
    })
});
