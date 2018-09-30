let img = document.getElementsByClassName('lazy_load');
let num = img.length;
let n = 0; // 存储加载到的位置，避免每次都从第一张图片开始遍历

// 获取当前元素距离body的偏移量
let offset = function (curEle) {
    let left = curEle.offsetLeft, top = curEle.offsetTop, par = curEle.offsetParent;
    while (par) {
        if (window.navigator.userAgent.indexOf("MSIE 8.0") <= -1) {
            // 处理其他浏览器情况，可优化
            left += par.clientLeft;
            top += par.clientTop;
        }
        left += par.offsetLeft;
        top += par.offsetTop;
        par = par.offsetParent;
    }
    return {left, top};
};

let lazyload = function (event) {
    const H = document.documentElement.clientHeight || document.body.clientHeight;
    const T = document.documentElement.scrollTop || document.body.scrollTop;
    for (let i = n; i < num; i++) {
        if (offset(img[i]).top < H + T) {
            if (img[i].getAttribute('src').includes('loading.svg')) {
                img[i].src = img[i].getAttribute('data-src')
            }
            n = i + 1;
        }
    }
};

// 防抖
const debounce = function (fn, delay) {
    let timeout;
    return function () {
        let context = this, args = arguments;
    }

};

// 节流
const throttle = function (fn, delay, time) {
    let timeout, startTime = new Date();
    return function () {
        var context = this,
            args = arguments,
            curTime = new Date();
        clearTimeout(timeout);
        if (curTime - startTime >= time) {
            fn.apply(context, args);
            startTime = curTime;
        } else {
            // 没达到触发间隔，重新设定定时器
            timeout = setTimeout(() => {
                fn.apply(context, args);
            }, delay)
        }
    }
};

lazyload();

window.addEventListener('scroll', throttle(lazyload, 500, 1000));

