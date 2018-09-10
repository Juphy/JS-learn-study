let request = require('request'),
    path = require('path'),
    async = require('async'),
    fs = require('fs');
const options = {
    url: 'https://api.imjad.cn/cloudmusic/',
    downLimit: 1,
    br: 198000,
    dirFile: 'music',
    dataFilename: 'music/data.json',
    imgFilename: 'music/images',
    musicFilename: 'music/songs',
    filename: 'music/music.json'
};
let files = ['music', 'music/images', 'music/songs'];
files.forEach(item => {
    if (!fs.existsSync(path.join(__dirname, item))) {
        fs.mkdirSync(path.join(__dirname, item));
    }
});
if (!fs.existsSync(path.join(__dirname, options.dataFilename))) {
    fs.open(path.join(__dirname, options.dataFilename), 'w', () => {
        const data = JSON.stringify({
            data: [],
            total: 0
        });
        fs.writeFileSync(path.join(__dirname, options.dataFilename), data);
    })
}

let writeJson = (params, pathname) => {
    let data = fs.readFileSync(pathname);
    let person = data.toString();
    person = JSON.parse(person);
    person.data = params;
    person.total = person.data.length;
    let str = JSON.stringify(person);
    fs.writeFileSync(pathname, str);
};

fs.readFile(path.join(__dirname, options.filename), (err, data) => {
    data = JSON.parse(data.toString());
    let songs = data['songs'], singers = data['singers'];
    async.mapLimit(songs, options.downLimit, (song, cb) => {
        request(encodeURI(`${options.url}?type=search&search_type=1&s=${song}`), (error, response, body) => {
            body = JSON.parse(body);
            let song = body['result']['songs'][0];
            cb(null, {name: song.name, id: song.id, img: song['al']['picUrl']});
        })
    }, (err, result) => {
        async.mapLimit(result, options.downLimit, (item, callback) => {
            request(encodeURI(`${options.url}?type=song&id=${item.id}&br=${options.br}`), (error, response, body) => {
                body = JSON.parse(body);
                let data = body['data'][0];
                callback(null, {url: data['url'], name: item['name'], id: item['id'], img: item['img']})
            })
        }, (err, result) => {
            async.eachLimit(result, options.downLimit, (url, cb) => {
                let filename = url.id;
                request(url.url).on('error', err => {
                    // cb();
                }).pipe(fs.createWriteStream(path.join(options.musicFilename, filename + '.' + url.url.split('.').pop())).on('finish', () => {
                    // cb();
                }));
                request(url.img).on('error', err => {
                    cb();
                }).pipe(fs.createWriteStream(path.join(options.imgFilename, filename + '.' + url.img.split('.').pop())).on('finish', () => {
                    cb();
                }));
            });
            writeJson(result, options.dataFilename)
        })
    })
});

