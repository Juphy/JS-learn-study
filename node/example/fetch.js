const fetch = require("node-fetch");
fetch('https://h1.ioliu.cn/bing/PyramidsOfMeroe_ZH-CN10667861825_1920x1080.jpg').then(res => {
    if (res['status'] === 200) {
        console.log(res);
    }
})