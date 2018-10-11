let debounce = function (fn, delay, flag) {
    // flag控制初始触发
    let timer;
    return function () {
        if (!timer && flag) {
            fn.apply(this, arguments);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    }
};

let _debounce = function (fn, delay, flag) {
    var timer, context, args, timestamp, result;
    var later = function () {
        var last = new Date() - timestamp;
        if (last > delay) {
            timer = null;
            if (!flag) {
                result = fn.apply(context, args);
            }
        } else {
            timer = setTimeout(later, delay - last)
        }
    };
    return function () {
        context = this;
        args = arguments;
        timestamp = new Date();
        var callNow = flag && !timer;
        if (!timer) {
            timer = setTimeout(later, delay);
        }
        if (callNow) {
            result = fn.apply(context, args);
            context = args = null;
        }
        return result;
    }
};

function throttle(fn, delay) {
    let timer, start_time = new Date();
    return function () {
        let cur_time = new Date(), last = cur_time - start_time;
        clearTimeout(timer);
        // 注意避免产生两次执行
        if (last >= delay) {
            fn.apply(this, arguments);
            start_time = cur_time;
        } else {
            timer = setTimeout(() => {
                fn.apply(this, arguments);
                start_time = cur_time;
            }, delay - last)
        }
    }
}

function _throttle(fn, delay, options = {}) {
    /*
    * options{leading: [false,true]} 是否马上触发（否：等待delay后才第一次触发）
    * options{trailing: [false,true]} 是否马上触发
    * */
    var timer, context, args, result;
    var previous = 0; // 上次执行的时间点

    var later = function () {
        // 如果开始边界不执行，上次的执行时间始终为0
        previous = options.leading === false ? 0 : new Date();
        timer = null;
        result = fn.apply(context, args);
        context = args = null;
    };

    return function () {
        var cur_time = new Date();
        // 首次执行时，如果设定了开始边界不执行，将上次执行时间设定为当前时间
        if (!previous && options.leading === false) previous = cur_time;
        var remaining = delay - (cur_time - previous); // 延迟执行的时间间隔
        context = this;
        args = arguments;
        // remaining<=0，表示上次执行至此所间隔的时间已经超过一个时间窗口
        // remaining>wait，表示客户端时间被调整过。
        if (remaining <= 0 || remaining > delay) {
            clearTimeout(timer);
            timer = null;
            previous = cur_time;
            result = fn.apply(context, args);
            context = args = null;
        } else if (!timer && options.trailing) {
            // 延迟执行不存在，且没有设定设定尾边界不执行选项
            timer = setTimeout(later, remaining);
        }
    }
}

let fn = () => {
    console.log(new Date());
};

// window.addEventListener('scroll', _debounce(fn, 1000, false));

window.addEventListener('scroll', _throttle(fn, 1000));
