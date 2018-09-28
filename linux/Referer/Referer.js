let http = require('http');
let option = {
    hostname: 'img.juphy.cn',
    path: '/mono/images/2018-8-22.jpg'
};

http.get(option, res => {
    let imgdata = '';
    res.on('data', chunk => {
        imgdata += chunk;
    });
    res.on('end', () => {
        console.log(imgdata);
    })
});