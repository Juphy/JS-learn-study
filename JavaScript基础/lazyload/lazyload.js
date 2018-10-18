// lazyLoad 标记需要懒加载
// default-src 还未加载真实图片时的展示，如果没有使用渐显的效果
// data-src 真实图片的地址
// offset 图片scroll多少需要加载，可正负
var lazyLoad = function (url = '../../assets/images/loading.svg') {
    let imgs = document.getElementsByTagName('img');
    // lazyLoad区分懒加载
    imgs = [...imgs].filter(item => {
        // 还未加载时展示的图片
        if (item.hasAttribute('default-src')) {
            item['src'] = item.getAttribute('default-src');
            item.style.opacity = 1;
        }
        // 设置图片未找到时的展示
        item.onerror = () => {
            item['src'] = url;
        };
        return item.hasAttribute('lazyLoad');
    });
    let num = imgs.length;
    let n = 0; // 存储加载到的位置，避免每次都从第一张图片开始遍历

    // 获取当前元素距离body的偏移量
    let offset = function (curEle) {
        let left = curEle.offsetLeft, top = curEle.offsetTop, par = curEle.offsetParent;
        while (par.tagName.toUpperCase() !== 'BODY') {
            if (window.navigator.userAgent.indexOf("MSIE 8.0") <= -1) {
                // 处理其他浏览器情况，亟需优化
                left += par.clientLeft;
                top += par.clientTop;
            }
            left += par.offsetLeft;
            top += par.offsetTop;
            par = par.offsetParent;
        }
        return {left, top};
    };

    // 原理：将页面中的img标签src指向一张小图片或者src为空，然后定义data-src（这个属性可以自定义命名）属性指向真实的图片。src指向一张默认的图片，否则当src为空时也会向服务器发送一次请求，可以指向loading的地址。图片要指定宽高。
    let main = function () {
        const H = document.documentElement.clientHeight || document.body.clientHeight; // 可视区域的高度
        const T = document.documentElement.scrollTop || document.body.scrollTop;
        for (let i = n; i < num; i++) {
            let h = imgs[i].hasAttribute('offset') ? Number(imgs[i].getAttribute('offset')) : 0;
            if (offset(imgs[i]).top < H + T - h) {
                // 将图片地址的真是地址放在自定义属性上
                imgs[i].src = imgs[i].getAttribute('data-src');
                imgs[i].className = imgs[i].className + ' lazy_load'; //class="lazy_load" {opacity: 1, transition: opacity 1s}
                n++;
            }
        }
    };

    // 防抖：任务频繁触发时，只有在任务触发的间隔超过指定间隔的时候，任务才会执行。事件被触发n秒后在执行回调函数，如果在这n秒内又被触发，则重新记时。
    const debounce = function (fn, delay) {
        let timeout;
        return function () {
            let context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        }
    };
    // main();
    // window.addEventListener('scroll', debounce(main, 800));

    // 节流函数：直接将函数绑定在window的scroll事件上，当页面滚动时，函数会被高频触发，非常影响浏览器的性能。因此只允许一个函数在一段时间内只执行一次。
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
                }, delay);
            }
        }
    };
    main(); // 页面加载完毕可视区域的图片
    window.addEventListener('scroll', throttle(main, 500, 1000));
};

