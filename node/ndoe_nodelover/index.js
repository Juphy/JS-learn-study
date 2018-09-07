let request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    async = require('async');
let options = {
    uri: '',
    dirFile: './output/',
    downLimit: 2
};

const start = () => {
    let url = 'https://nodelover.me/courses';
    down(url);
};

async function down(url) {
    let prolist = await new Promise(resolve => {
        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let $ = cheerio.load(body, {
                    normalizeWhitespace: true,
                    decodeEntities: false
                });
                const list = [];
                $('.course-item.c1').each((index, item) => {
                    let json = {
                        title: $(item).find('.link h1').text() + $(item).find('.course-type.vip').text(),
                        othertitle: $(item).find('.desc').text(),
                        class: $(item).find('.subtitle small').eq(0).text(),
                        Releasetime: $(item).find('.subtitle small').eq(0).text(),
                        coursetime: $(item).find('.subtitle small').eq(0).text(),
                        url: $(item).find('.link').attr('href')
                    };
                    list.push(json);
                });
                resolve(list);
            }
        })
    });
    console.log(prolist);
    prolist.length = 2;
    for (var opt of prolist) {
        if (!opt.title) return;
        await mkdir(opt.title);
        let videoList = await new Promise(resolve => {
            request('https://nodelover.me' + opt.url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let $ = cheerio.load(body, {
                        normalizeWhitespace: true,
                        decodeEntities: false
                    });
                    const list = [];
                    $('.video-list li').each((index, obj) => {
                        let json = {
                            title: $(obj).find('a').text(),
                            url: 'http://cdn.nodelover.me/video_bucket' + $(obj).find('a').attr('href').replace('/course', '') + '.mp4'
                        };
                        list.push(json);
                    });
                    resolve(list);
                }
            })
        });
        await sleep(2000);
        await downliu(opt.title, videoList, () => {
            console.log(opt.title + '下载结束'.info, opt.title);
        })
    }
}

/**
 * 创建目录
 */
function mkdir(title) {

    console.log('准备创建目录：%s', title);
    if (fs.existsSync(options.dirFile + title)) {
        console.log('目录：%s 已经存在'.error, title);

    } else {
        mkdirp(options.dirFile + title, function (err) {
            console.log('目录：%s 创建成功'.info, title);
        });
    }
}

function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
};

/**
 * 下载视频
 */
function downliu(dir, links, callback) {
    console.log('发现%d张图片，准备开始下载...', links.length);
    //eachLimits 控制下载视频并行上限 第二个参数 options.downLimit 就是配置
    async.eachLimit(links, options.downLimit, function (url, cb) {
        // url指的是link，links中的每一项
        //获取url最后的名字
        var fileName = path.basename(url.title).replace(/&nbsp;/g, ''); // basename附带加‘.’功能
        //去掉/
        var toPath = path.join(options.dirFile + dir, fileName);
        console.log('开始下载视频：%s，保存到：%s', fileName, dir);
//这个地方要详细说了
        request(encodeURI(url.url)).on('error', function (err) {
            cb();
        }).pipe(fs.createWriteStream(toPath + ".mp4")).on('finish', () => {
            console.log('视频下载成功：%s', url.url);
            cb();
        })
    }, callback);
}

start();
